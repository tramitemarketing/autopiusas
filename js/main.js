/**
 * Auto Più S.A.S. - JavaScript Principale
 */

// ==========================================================================
// Dati Auto (caricati da Firestore)
// ==========================================================================
let autoDisponibili = [];

// ==========================================================================
// DOM Elements
// ==========================================================================
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const autoGrid = document.getElementById('auto-grid');

// ==========================================================================
// Inizializzazione
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    updateFooterYear();
    setupScrollAnimations();
    setupForm();
    setupCookieBanner();

    // Carica auto da Firestore solo nelle pagine con il catalogo
    if (document.getElementById('auto-grid') && typeof db !== 'undefined') {
        caricaAutoDaFirestore();
    }
});

// ==========================================================================
// Caricamento Auto da Firestore
// ==========================================================================
function caricaAutoDaFirestore() {
    const grid = document.getElementById('auto-grid');
    grid.innerHTML = '<p class="catalogo__empty">Caricamento auto in corso...</p>';

    db.collection('auto')
        .orderBy('creatoIl', 'desc')
        .get()
        .then(snapshot => {
            autoDisponibili = [];
            snapshot.forEach(doc => {
                autoDisponibili.push({ id: doc.id, ...doc.data() });
            });
            // Ordina: auto attive prima, vendute in fondo
            autoDisponibili.sort((a, b) => {
                const aAttiva = a.attiva !== false ? 0 : 1;
                const bAttiva = b.attiva !== false ? 0 : 1;
                return aAttiva - bAttiva;
            });
            renderAutoGrid();
            setupFilters();
        })
        .catch(error => {
            console.error('Errore caricamento auto:', error);
            grid.innerHTML = '<p class="catalogo__empty">Errore nel caricamento del catalogo. Riprova più tardi.</p>';
        });
}

// ==========================================================================
// Render Griglia Auto
// ==========================================================================
function renderAutoGrid(autoList) {
    if (!autoGrid) return;

    const list = autoList || autoDisponibili;

    if (list.length === 0) {
        autoGrid.innerHTML = '<p class="catalogo__empty">Nessuna auto trovata con i filtri selezionati. Prova a modificare i criteri di ricerca.</p>';
        return;
    }

    autoGrid.innerHTML = list.map(auto => {
        const venduta = auto.attiva === false;
        const cardClass = venduta ? 'card card--venduta animate-on-scroll' : 'card animate-on-scroll';
        const badge = venduta ? '<span class="card__badge-venduta">VENDUTA</span>' : '';
        const btnHtml = venduta ? '' : '<a href="index.html#richiedi-info" class="btn btn--primary btn--small card__btn">Richiedi Info</a>';

        return `
        <article class="${cardClass}">
            <div class="card__image-wrap">
                <img
                    src="${auto.immagine}"
                    alt="${auto.marca} ${auto.modello} ${auto.anno}"
                    class="card__image"
                    loading="lazy"
                >
                ${badge}
            </div>
            <div class="card__content">
                <h3 class="card__title">${auto.marca} ${auto.modello}</h3>
                <div class="card__details">
                    <span class="card__detail">${auto.anno}</span>
                    <span class="card__detail">${formatKm(auto.chilometri)} km</span>
                    <span class="card__detail">${auto.alimentazione}</span>
                    <span class="card__detail">${auto.cambio}</span>
                </div>
                <p class="card__price">${venduta ? '<s>' + formatPrezzo(auto.prezzo) + '</s>' : formatPrezzo(auto.prezzo)}</p>
                <p class="card__description">${auto.descrizione}</p>
                ${btnHtml}
            </div>
        </article>
        `;
    }).join('');

    setupScrollAnimations();
}

// ==========================================================================
// Filtri Catalogo
// ==========================================================================
function setupFilters() {
    const filtroMarca = document.getElementById('filtro-marca');
    const filtroAlimentazione = document.getElementById('filtro-alimentazione');
    const filtroPrezzo = document.getElementById('filtro-prezzo');
    const resetBtn = document.getElementById('filtri-reset');

    if (!filtroMarca) return;

    // Popola opzioni marca
    const marche = [...new Set(autoDisponibili.map(a => a.marca))].sort();
    marche.forEach(marca => {
        const opt = document.createElement('option');
        opt.value = marca;
        opt.textContent = marca;
        filtroMarca.appendChild(opt);
    });

    // Popola opzioni alimentazione
    const alimentazioni = [...new Set(autoDisponibili.map(a => a.alimentazione))].sort();
    alimentazioni.forEach(al => {
        const opt = document.createElement('option');
        opt.value = al;
        opt.textContent = al;
        filtroAlimentazione.appendChild(opt);
    });

    // Event listeners
    filtroMarca.addEventListener('change', applyFilters);
    filtroAlimentazione.addEventListener('change', applyFilters);
    filtroPrezzo.addEventListener('change', applyFilters);
    resetBtn.addEventListener('click', () => {
        filtroMarca.value = '';
        filtroAlimentazione.value = '';
        filtroPrezzo.value = '';
        applyFilters();
    });
}

function applyFilters() {
    const marca = document.getElementById('filtro-marca').value;
    const alimentazione = document.getElementById('filtro-alimentazione').value;
    const prezzoMax = document.getElementById('filtro-prezzo').value;

    const filtered = autoDisponibili.filter(auto => {
        if (marca && auto.marca !== marca) return false;
        if (alimentazione && auto.alimentazione !== alimentazione) return false;
        if (prezzoMax && auto.prezzo > parseInt(prezzoMax)) return false;
        return true;
    });

    renderAutoGrid(filtered);
}

// ==========================================================================
// Form Contatto (Mailto)
// ==========================================================================
function setupForm() {
    const form = document.getElementById('form-contatto');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const nome = document.getElementById('nome').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const servizio = document.getElementById('servizio').value;
        const messaggio = document.getElementById('messaggio').value.trim();

        const subject = 'Richiesta informazioni' + (servizio ? ' - ' + servizio : '');
        const bodyText = 'Nome: ' + nome + '\n' +
            'Telefono: ' + (telefono || 'Non fornito') + '\n' +
            'Servizio: ' + (servizio || 'Non specificato') + '\n\n' +
            'Messaggio:\n' + messaggio;

        const destinatario = 'autopiusas@pec.it';
        const mailtoLink = 'mailto:' + destinatario + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);

        // Gmail web link (per PC senza client email)
        const gmailLink = 'https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(destinatario) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);

        // Prova ad aprire mailto (funziona su mobile con app email)
        // e apri Gmail in un nuovo tab come fallback per desktop
        var mailtoAperto = false;
        var w = window.open(mailtoLink, '_self');

        // Dopo un breve delay, se siamo probabilmente su desktop senza client email,
        // apri anche Gmail web come alternativa
        setTimeout(function() {
            window.open(gmailLink, '_blank');
        }, 500);
    });
}

function validateForm() {
    let valid = true;

    // Pulisci errori precedenti
    document.querySelectorAll('.form__error').forEach(el => { el.textContent = ''; });
    document.querySelectorAll('.form__input--error').forEach(el => { el.classList.remove('form__input--error'); });

    // Nome
    const nome = document.getElementById('nome');
    if (!nome.value.trim()) {
        showFormError('nome', 'Il nome è obbligatorio');
        valid = false;
    }

    // Telefono (facoltativo ma se compilato deve essere valido)
    const telefono = document.getElementById('telefono');
    if (telefono.value.trim()) {
        const phoneClean = telefono.value.trim().replace(/[\s\-\+\(\)]/g, '');
        if (phoneClean.length < 9 || !/^\d+$/.test(phoneClean)) {
            showFormError('telefono', 'Inserisci un numero valido (minimo 9 cifre)');
            valid = false;
        }
    }

    // Messaggio (obbligatorio)
    const messaggio = document.getElementById('messaggio');
    if (!messaggio.value.trim()) {
        showFormError('messaggio', 'Il messaggio è obbligatorio');
        valid = false;
    }

    return valid;
}

function showFormError(fieldId, message) {
    const errorEl = document.getElementById('errore-' + fieldId);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('form__input--error');
}

// ==========================================================================
// Cookie Banner
// ==========================================================================
function setupCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    var consent = localStorage.getItem('cookie-consent');
    if (consent) return;

    banner.removeAttribute('hidden');

    document.getElementById('cookie-accetta').addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        banner.setAttribute('hidden', '');
    });

    document.getElementById('cookie-rifiuta').addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'rejected');
        banner.setAttribute('hidden', '');
    });
}

// ==========================================================================
// Navigazione Mobile
// ==========================================================================
function setupNavigation() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    document.addEventListener('click', (e) => {
        if (navMenu && navToggle &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// ==========================================================================
// Animazioni Scroll (Intersection Observer)
// ==========================================================================
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }
}

// ==========================================================================
// Funzioni Utilità
// ==========================================================================
function formatPrezzo(prezzo) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(prezzo);
}

function formatKm(km) {
    return new Intl.NumberFormat('it-IT').format(km);
}

// ==========================================================================
// Aggiorna Anno Footer
// ==========================================================================
function updateFooterYear() {
    const annoElement = document.getElementById('anno-corrente');
    if (annoElement) {
        annoElement.textContent = new Date().getFullYear();
    }
}

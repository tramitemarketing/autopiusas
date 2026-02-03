/**
 * Auto Più S.A.S. - Pannello Amministrazione
 */

const auth = firebase.auth();

// Stato locale
let autoList = [];
let autoIdDaEliminare = null;

// ==========================================================================
// Elementi DOM
// ==========================================================================
const loginSection = document.getElementById('admin-login');
const dashboardSection = document.getElementById('admin-dashboard');
const btnLogout = document.getElementById('btn-logout');
const loginForm = document.getElementById('login-form');
const loginErrore = document.getElementById('login-errore');

const adminTbody = document.getElementById('admin-auto-tbody');
const adminLoading = document.getElementById('admin-loading');
const adminEmpty = document.getElementById('admin-empty');

const modalAuto = document.getElementById('modal-auto');
const modalTitolo = document.getElementById('modal-titolo');
const formAuto = document.getElementById('form-auto');
const modalElimina = document.getElementById('modal-elimina');

// ==========================================================================
// Autenticazione
// ==========================================================================
auth.onAuthStateChanged(user => {
    if (user) {
        loginSection.hidden = true;
        dashboardSection.hidden = false;
        btnLogout.hidden = false;
        caricaAuto();
    } else {
        loginSection.hidden = false;
        dashboardSection.hidden = true;
        btnLogout.hidden = true;
    }
});

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    loginErrore.textContent = '';

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            const messaggi = {
                'auth/wrong-password': 'Password errata.',
                'auth/user-not-found': 'Utente non trovato.',
                'auth/invalid-email': 'Email non valida.',
                'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
                'auth/invalid-credential': 'Credenziali non valide.'
            };
            loginErrore.textContent = messaggi[error.code] || 'Errore di accesso. Riprova.';
        });
});

btnLogout.addEventListener('click', () => {
    auth.signOut();
});

// ==========================================================================
// Carica Auto da Firestore
// ==========================================================================
function caricaAuto() {
    adminLoading.hidden = false;
    adminEmpty.hidden = true;
    adminTbody.innerHTML = '';

    db.collection('auto')
        .orderBy('creatoIl', 'desc')
        .get()
        .then(snapshot => {
            autoList = [];
            snapshot.forEach(doc => {
                autoList.push({ id: doc.id, ...doc.data() });
            });
            renderTabella();
            aggiornaStats();
            adminLoading.hidden = true;
        })
        .catch(error => {
            console.error('Errore caricamento:', error);
            adminLoading.textContent = 'Errore nel caricamento. Riprova.';
        });
}

// ==========================================================================
// Render Tabella Admin
// ==========================================================================
function renderTabella() {
    if (autoList.length === 0) {
        adminEmpty.hidden = false;
        adminTbody.innerHTML = '';
        return;
    }

    adminEmpty.hidden = true;

    adminTbody.innerHTML = autoList.map(auto => {
        const attiva = auto.attiva !== false;
        const badgeClass = attiva ? 'badge--attiva' : 'badge--venduta';
        const badgeText = attiva ? 'In vendita' : 'Venduta';
        const toggleText = attiva ? 'Venduta' : 'Riattiva';
        const imgSrc = auto.immagine || 'https://via.placeholder.com/80x50/E0E0E0/666666?text=No+Foto';

        return `
            <tr>
                <td data-label="Foto">
                    <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(auto.marca)} ${escapeHtml(auto.modello)}" class="admin-table__thumb">
                </td>
                <td data-label="Auto"><strong>${escapeHtml(auto.marca)} ${escapeHtml(auto.modello)}</strong></td>
                <td data-label="Anno">${auto.anno || '-'}</td>
                <td data-label="Prezzo">${formatPrezzo(auto.prezzo)}</td>
                <td data-label="Stato"><span class="badge ${badgeClass}">${badgeText}</span></td>
                <td data-label="Azioni">
                    <div class="admin-actions">
                        <button class="btn btn--primary btn--icon" onclick="apriModalModifica('${auto.id}')">Modifica</button>
                        <button class="btn btn--outline btn--icon" onclick="toggleVenduta('${auto.id}', ${attiva})">${toggleText}</button>
                        <button class="btn btn--danger btn--icon" onclick="confermaEliminazione('${auto.id}', '${escapeHtml(auto.marca)} ${escapeHtml(auto.modello)}')">Elimina</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ==========================================================================
// Statistiche
// ==========================================================================
function aggiornaStats() {
    const totale = autoList.length;
    const attive = autoList.filter(a => a.attiva !== false).length;
    const vendute = totale - attive;

    document.getElementById('stat-totale').textContent = totale;
    document.getElementById('stat-attive').textContent = attive;
    document.getElementById('stat-vendute').textContent = vendute;
}

// ==========================================================================
// Modal Aggiungi
// ==========================================================================
document.getElementById('btn-aggiungi-auto').addEventListener('click', () => {
    modalTitolo.textContent = 'Aggiungi Auto';
    formAuto.reset();
    document.getElementById('auto-id').value = '';
    document.getElementById('auto-immagine-url').value = '';
    document.getElementById('auto-attiva').value = 'true';
    document.getElementById('auto-foto-url').value = '';
    document.getElementById('foto-preview').innerHTML = '';
    modalAuto.hidden = false;
});

// Chiudi modal
document.getElementById('modal-chiudi').addEventListener('click', chiudiModal);
document.getElementById('btn-annulla').addEventListener('click', chiudiModal);

modalAuto.addEventListener('click', e => {
    if (e.target === modalAuto) chiudiModal();
});

function chiudiModal() {
    modalAuto.hidden = true;
}

// ==========================================================================
// Modal Modifica
// ==========================================================================
function apriModalModifica(autoId) {
    const auto = autoList.find(a => a.id === autoId);
    if (!auto) return;

    modalTitolo.textContent = 'Modifica Auto';
    document.getElementById('auto-id').value = auto.id;
    document.getElementById('auto-marca').value = auto.marca || '';
    document.getElementById('auto-modello').value = auto.modello || '';
    document.getElementById('auto-anno').value = auto.anno || '';
    document.getElementById('auto-km').value = auto.chilometri || '';
    document.getElementById('auto-prezzo').value = auto.prezzo || '';
    document.getElementById('auto-alimentazione').value = auto.alimentazione || '';
    document.getElementById('auto-cambio').value = auto.cambio || '';
    document.getElementById('auto-attiva').value = auto.attiva !== false ? 'true' : 'false';
    document.getElementById('auto-descrizione').value = auto.descrizione || '';
    document.getElementById('auto-immagine-url').value = auto.immagine || '';
    document.getElementById('auto-foto-url').value = auto.immagine || '';

    const preview = document.getElementById('foto-preview');
    if (auto.immagine) {
        preview.innerHTML = `<img src="${escapeHtml(auto.immagine)}" alt="Anteprima">`;
    } else {
        preview.innerHTML = '';
    }

    modalAuto.hidden = false;
}

// ==========================================================================
// Anteprima Foto da URL
// ==========================================================================
document.getElementById('auto-foto-url').addEventListener('input', e => {
    const url = e.target.value.trim();
    const preview = document.getElementById('foto-preview');

    if (!url) {
        preview.innerHTML = '';
        return;
    }

    // Mostra anteprima se sembra un URL valido
    if (url.startsWith('http://') || url.startsWith('https://')) {
        preview.innerHTML = `<img src="${escapeHtml(url)}" alt="Anteprima" onerror="this.style.display='none'">`;
    }
});

// ==========================================================================
// Salva Auto (Aggiungi o Modifica)
// ==========================================================================
formAuto.addEventListener('submit', async e => {
    e.preventDefault();

    const btnSalva = document.getElementById('btn-salva');
    btnSalva.disabled = true;
    btnSalva.textContent = 'Salvando...';

    try {
        const autoId = document.getElementById('auto-id').value;
        const immagineUrl = document.getElementById('auto-foto-url').value.trim();

        const dati = {
            marca: document.getElementById('auto-marca').value.trim(),
            modello: document.getElementById('auto-modello').value.trim(),
            anno: parseInt(document.getElementById('auto-anno').value),
            chilometri: parseInt(document.getElementById('auto-km').value),
            prezzo: parseInt(document.getElementById('auto-prezzo').value),
            alimentazione: document.getElementById('auto-alimentazione').value,
            cambio: document.getElementById('auto-cambio').value,
            attiva: document.getElementById('auto-attiva').value === 'true',
            descrizione: document.getElementById('auto-descrizione').value.trim(),
            immagine: immagineUrl,
            modificatoIl: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (autoId) {
            await db.collection('auto').doc(autoId).update(dati);
            mostraNotifica('Auto aggiornata con successo!', 'successo');
        } else {
            dati.creatoIl = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('auto').add(dati);
            mostraNotifica('Auto aggiunta al catalogo!', 'successo');
        }

        chiudiModal();
        caricaAuto();
    } catch (error) {
        console.error('Errore salvataggio:', error);
        mostraNotifica('Errore nel salvataggio. Riprova.', 'errore');
    } finally {
        btnSalva.disabled = false;
        btnSalva.textContent = 'Salva Auto';
    }
});

// ==========================================================================
// Toggle Venduta/In vendita
// ==========================================================================
function toggleVenduta(autoId, attualeAttiva) {
    db.collection('auto').doc(autoId).update({
        attiva: !attualeAttiva,
        modificatoIl: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        mostraNotifica(attualeAttiva ? 'Auto segnata come venduta.' : 'Auto rimessa in vendita.', 'successo');
        caricaAuto();
    })
    .catch(error => {
        console.error('Errore aggiornamento stato:', error);
        mostraNotifica('Errore. Riprova.', 'errore');
    });
}

// ==========================================================================
// Elimina Auto
// ==========================================================================
function confermaEliminazione(autoId, nomeAuto) {
    autoIdDaEliminare = autoId;
    document.getElementById('elimina-messaggio').textContent =
        `Sei sicuro di voler eliminare "${nomeAuto}"? Questa azione non può essere annullata.`;
    modalElimina.hidden = false;
}

document.getElementById('btn-elimina-annulla').addEventListener('click', () => {
    modalElimina.hidden = true;
    autoIdDaEliminare = null;
});

modalElimina.addEventListener('click', e => {
    if (e.target === modalElimina) {
        modalElimina.hidden = true;
        autoIdDaEliminare = null;
    }
});

document.getElementById('btn-elimina-conferma').addEventListener('click', async () => {
    if (!autoIdDaEliminare) return;

    const btnConferma = document.getElementById('btn-elimina-conferma');
    btnConferma.disabled = true;
    btnConferma.textContent = 'Eliminando...';

    try {
        await db.collection('auto').doc(autoIdDaEliminare).delete();
        mostraNotifica('Auto eliminata.', 'successo');
        modalElimina.hidden = true;
        autoIdDaEliminare = null;
        caricaAuto();
    } catch (error) {
        console.error('Errore eliminazione:', error);
        mostraNotifica('Errore nell\'eliminazione. Riprova.', 'errore');
    } finally {
        btnConferma.disabled = false;
        btnConferma.textContent = 'Elimina';
    }
});

// ==========================================================================
// Notifiche Toast
// ==========================================================================
function mostraNotifica(messaggio, tipo) {
    const toast = document.createElement('div');
    toast.className = 'admin-toast admin-toast--' + tipo;
    toast.textContent = messaggio;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================================================
// Utility
// ==========================================================================
function formatPrezzo(prezzo) {
    if (!prezzo && prezzo !== 0) return '-';
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(prezzo);
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

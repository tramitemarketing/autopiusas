# CLAUDE.md - Auto Più S.A.S.
 
## Panoramica Progetto
 
Sito web single-page per **Auto Più S.A.S.**, rivenditore di auto usate.
Layout verticale semplice con navigazione fluida tra le sezioni.
 
---
 
## Struttura del Sito
 
```
/
├── index.html          # Pagina principale (single-page)
├── css/
│   └── style.css       # Stili principali
├── js/
│   └── main.js         # Script per prenotazioni e interattività
├── images/
│   └── auto/           # Foto delle auto in vendita
└── CLAUDE.md           # Questo file
```
 
---
 
## Sezioni della Pagina
 
### 1. Header / Navigazione
- Logo "Auto Più S.A.S."
- Menu di navigazione ancorato alle sezioni:
  - Chi Siamo
  - Le Nostre Auto
  - Prenota
  - Contatti
 
### 2. Hero / Presentazione
- Titolo principale con slogan
- Breve descrizione dell'attività
- Call-to-action verso la sezione auto
 
### 3. Chi Siamo (Presentazione)
- Storia dell'azienda
- Valori: affidabilità, trasparenza, convenienza
- Anni di esperienza nel settore
 
### 4. Le Nostre Auto (Esposizione)
- Griglia/lista di auto disponibili
- Ogni auto mostra:
  - Foto
  - Marca e modello
  - Anno
  - Chilometraggio
  - Prezzo
  - Pulsante "Prenota Visione"
 
### 5. Prenota (Sistema Prenotazioni)
- Form di prenotazione con campi:
  - Nome e Cognome (obbligatorio)
  - Email (obbligatorio)
  - Telefono (obbligatorio)
  - Auto di interesse (select dropdown)
  - Data preferita per visita
  - Orario preferito
  - Note aggiuntive (textarea)
- Pulsante "Invia Prenotazione"
- Messaggio di conferma dopo invio
 
### 6. Contatti
- Indirizzo completo
- Numero di telefono
- Email
- Orari di apertura
- Mappa integrata (Google Maps embed)
 
### 7. Footer
- Copyright
- Link privacy policy
- Social media (opzionale)
 
---
 
## Palette Colori
 
| Utilizzo | Colore | Codice HEX |
|----------|--------|------------|
| Sfondo principale | Bianco | `#FFFFFF` |
| Sfondo alternativo | Bianco sporco | `#FAFAFA` |
| Colore primario | Giallo | `#FFD700` |
| Giallo scuro (hover) | Giallo oro | `#E6C200` |
| Giallo chiaro (accenti) | Giallo pallido | `#FFF8DC` |
| Testo principale | Grigio scuro | `#333333` |
| Testo secondario | Grigio | `#666666` |
| Bordi | Grigio chiaro | `#E0E0E0` |
 
---
 
## Stile e Design
 
### Principi
- **Semplicità**: design pulito, senza elementi superflui
- **Verticale**: tutte le sezioni in colonna, scorrimento fluido
- **Mobile-first**: responsive per tutti i dispositivi
- **Leggibilità**: font chiari, contrasti adeguati
 
### Tipografia
```css
/* Font principale */
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 
/* Titoli */
h1: 2.5rem, bold
h2: 2rem, bold
h3: 1.5rem, semibold
 
/* Testo */
body: 1rem (16px)
```
 
### Componenti UI
- **Pulsanti**: sfondo giallo `#FFD700`, testo scuro, bordi arrotondati (8px)
- **Card auto**: sfondo bianco, ombra leggera, bordo giallo al hover
- **Form**: campi con bordo grigio, focus con bordo giallo
- **Sezioni**: padding generoso (60px verticale), alternanza sfondo bianco/bianco sporco
 
---
 
## Struttura Dati Auto
 
```javascript
// Esempio struttura per ogni auto
{
  id: 1,
  marca: "Fiat",
  modello: "Panda",
  anno: 2019,
  chilometri: 45000,
  prezzo: 8500,
  alimentazione: "Benzina",
  cambio: "Manuale",
  immagine: "images/auto/fiat-panda-2019.jpg",
  descrizione: "Ottimo stato, tagliandi regolari"
}
```
 
---
 
## Sistema Prenotazioni
 
### Flusso Utente
1. Utente naviga alla sezione "Le Nostre Auto"
2. Seleziona un'auto e clicca "Prenota Visione"
3. Viene scrollato al form con l'auto pre-selezionata
4. Compila i dati richiesti
5. Invia la prenotazione
6. Riceve conferma visiva
 
### Validazione Form
- Tutti i campi obbligatori devono essere compilati
- Email in formato valido
- Telefono: solo numeri, minimo 9 cifre
- Data: non nel passato
 
### Gestione Backend (da implementare)
- Opzione 1: Invio email tramite servizio (EmailJS, Formspree)
- Opzione 2: Backend PHP/Node.js con database
- Opzione 3: Integrazione con Google Forms/Sheets
 
---
 
## Convenzioni di Codice
 
### HTML
- Semantico: usare `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- ID per le sezioni di navigazione: `#chi-siamo`, `#auto`, `#prenota`, `#contatti`
- Classi BEM per componenti: `.card`, `.card__image`, `.card__title`
 
### CSS
- Mobile-first con media queries per schermi più grandi
- Variabili CSS per i colori:
```css
:root {
  --color-primary: #FFD700;
  --color-primary-dark: #E6C200;
  --color-primary-light: #FFF8DC;
  --color-white: #FFFFFF;
  --color-bg-alt: #FAFAFA;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-border: #E0E0E0;
}
```
 
### JavaScript
- Vanilla JS (no framework richiesto per semplicità)
- Event listeners per smooth scroll
- Validazione form lato client
- Gestione stato prenotazione
 
---
 
## SEO e Accessibilità
 
### Meta Tags Essenziali
```html
<title>Auto Più S.A.S. - Auto Usate Garantite</title>
<meta name="description" content="Rivenditore di auto usate...">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
 
### Accessibilità
- Alt text su tutte le immagini
- Label associate ai campi form
- Contrasto colori WCAG AA
- Navigazione da tastiera funzionante
 
---
 
## Contenuti Placeholder
 
### Testi Suggeriti
 
**Slogan Hero:**
> "La tua prossima auto ti aspetta da Auto Più S.A.S."
 
**Chi Siamo:**
> "Da oltre [X] anni, Auto Più S.A.S. è sinonimo di fiducia e qualità nel mercato dell'usato. Ogni veicolo viene accuratamente selezionato e controllato per garantirti la massima tranquillità."
 
**Call to Action:**
> "Scopri le nostre auto" / "Prenota una visita"
 
---
 
## Comandi Utili per lo Sviluppo
 
```bash
# Avviare server locale per test
python -m http.server 8000
# oppure
npx serve .
 
# Validare HTML
npx html-validate index.html
```
 
---
 
## Note per l'Assistente AI
 
1. **Priorità**: funzionalità base prima, poi miglioramenti estetici
2. **Semplicità**: evitare over-engineering, il sito deve essere mantenibile
3. **Palette**: attenersi rigorosamente a bianco e giallo
4. **Responsive**: testare sempre su mobile
5. **Form**: la validazione lato client è essenziale
6. **Immagini**: usare placeholder se non disponibili (`via.placeholder.com` o simili)

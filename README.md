# API Studenti

REST API didattiche per esercitarsi con le richieste HTTP.

## Setup

```bash
npm install
npm run dev
```

L'API sarà disponibile su `http://localhost:3000`.
La documentazione interattiva Swagger sarà su `http://localhost:3000/api-docs`.

## Endpoints

| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/student` | Lista tutti gli studenti |
| GET | `/student/:id` | Ritorna uno studente per UUID |
| POST | `/student` | Crea uno studente |
| PUT | `/student/:id` | Aggiorna uno studente (tutti i campi obbligatori) |
| DELETE | `/student/:id` | Elimina uno studente |

## Esempio body POST/PUT

```json
{
  "name": "Mario",
  "lastname": "Rossi",
  "email": "mario.rossi@email.com",
  "age": 22
}
```

## Risposte di errore

| Status | Quando | Body |
|--------|--------|------|
| 400 | Dati non validi | `{ "errors": ["..."] }` |
| 404 | Studente non trovato | `{ "error": "Student not found" }` |
| 409 | Email già in uso | `{ "error": "Email already in use" }` |
| 500 | Errore interno | `{ "error": "Internal server error" }` |

## Note

- Il database SQLite (`students.db`) viene creato automaticamente al primo avvio
- Al primo avvio vengono precaricati 8 studenti di esempio
- CORS abilitato per tutti le origini — puoi chiamare le API da qualsiasi frontend locale
- Nessuna autenticazione richiesta

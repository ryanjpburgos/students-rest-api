# API Studenti

Educational REST APIs for practicing HTTP requests.

## Setup

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.
The interactive Swagger documentation will be at `http://localhost:3000/api-docs`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/student` | List all students |
| GET | `/student/:id` | Returns a student by UUID |
| POST | `/student` | Create a student |
| PUT | `/student/:id` | Update a student (all fields required) |
| DELETE | `/student/:id` | Delete a student |

## POST/PUT body example

```json
{
  "name": "Mario",
  "lastname": "Rossi",
  "email": "mario.rossi@email.com",
  "age": 22
}
```

## Error responses

| Status | When | Body |
|--------|------|------|
| 400 | Invalid data | `{ "errors": ["..."] }` |
| 404 | Student not found | `{ "error": "Student not found" }` |
| 409 | Email already in use | `{ "error": "Email already in use" }` |
| 500 | Internal error | `{ "error": "Internal server error" }` |

## Notes

- The SQLite database (`students.db`) is created automatically on first run
- On first run, 8 sample students are seeded
- CORS enabled for all origins — can call APIs from any local frontend
- No authentication required

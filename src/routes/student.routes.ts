import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/student.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         name:
 *           type: string
 *           example: "Mario"
 *         lastname:
 *           type: string
 *           example: "Rossi"
 *         email:
 *           type: string
 *           format: email
 *           example: "mario.rossi@email.com"
 *         age:
 *           type: integer
 *           example: 22
 *     StudentInput:
 *       type: object
 *       required: [name, lastname, email, age]
 *       properties:
 *         name:
 *           type: string
 *           example: "Mario"
 *         lastname:
 *           type: string
 *           example: "Rossi"
 *         email:
 *           type: string
 *           format: email
 *           example: "mario.rossi@email.com"
 *         age:
 *           type: integer
 *           example: 22
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Student not found"
 *     ValidationErrors:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Invalid email format", "age must be a positive number"]
 */

/**
 * @swagger
 * /student:
 *   get:
 *     summary: Ritorna tutti gli studenti
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Lista di tutti gli studenti
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', getAll);

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Ritorna uno studente per ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID dello studente
 *     responses:
 *       200:
 *         description: Studente trovato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Studente non trovato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getById);

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Crea un nuovo studente
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       201:
 *         description: Studente creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Dati non validi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       409:
 *         description: Email già in uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', create);

/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: Aggiorna uno studente esistente
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID dello studente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       200:
 *         description: Studente aggiornato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Dati non validi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       404:
 *         description: Studente non trovato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email già in uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', update);

/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Elimina uno studente
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID dello studente
 *     responses:
 *       204:
 *         description: Studente eliminato con successo
 *       404:
 *         description: Studente non trovato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', remove);

export default router;

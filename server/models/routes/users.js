import express from 'express';
import sql from '../database/src.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    const users = await sql`
        SELECT * FROM users` ;
    res.json(users);
});

//GET user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const [user] = await sql`
        SELECT * FROM users
        WHERE id = ${id}
        `;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

//GET user by username
router.get('/:username', async (req, res) => {
    const {username} = req.params;
    const {user} = await sql`
        SELECT * FROM users
        WHERE username = ${username}
        `;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

//POST register new user
router.post('/', async (req, res) => {
    const { username, name, surname, email, password } = req.body;
    const [user] = await sql`
        INSERRT INTO users (username, name, surname, email, password, role)
        VALUES (${username}, ${name}, ${surname}, ${email}, ${password}, 'customer')
        RETURNING *
        `;
        res.status(201).json(user);
});

//PUT update user
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const { username, name, surname, email } = req.body;
    const [user] = await sql`
        UPDATE users
        SET username = ${username}, name = ${name}, surname = ${surname}, email = ${email}
        WHERE id = ${id}
        RETURNING id, username, name, surname, email
        `;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// DELETE user
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    await sql`DELETE FROM users WHERE id = ${id}`;
    res.json({message: "User deleted"});
});

export default router; 
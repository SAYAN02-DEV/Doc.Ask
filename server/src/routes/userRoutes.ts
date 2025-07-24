import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userAuth from '../middlewares/userAuth';
import { UserModel } from '../models/db';

const router = express.Router();
const JWT_SECRET = "thisismyproject";

router.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        await UserModel.create({ email, name, password });
        res.json({ message: "You are signed up!" });
    } catch (err) {
        return res.status(400).json({ message: "User already exists!" });
    }
});
router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (user) {
        const token = jwt.sign({ email: user.email }, JWT_SECRET);
        res.json({ token, msg: "You are signed in!" });
    } else {
        res.status(403).json({ message: "Invalid Credentials!" });
    }
});
router.get('/test', (req: Request, res: Response) => {
    res.send("Deployed successfully!");
});

export default router;

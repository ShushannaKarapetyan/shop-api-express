import express from 'express';
import User from '../models/User.js';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const router = express.Router();

async function register(req, res) {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
    })

    try {
        let savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

async function login(req, res) {
    try {
        let user = await User.findOne({username: req.body.username});
        !user && res.status(401).json('Wrong credentials.');

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const pass = hashedPassword.toString(CryptoJS.enc.Utf8);

        pass !== req.body.password &&
        res.status(401).json('Wrong credentials pass.');

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '3d',
            }
        );

        // remove password from response
        const {password, ...others} = user._doc;

        res.status(200).json({others, accessToken});
    } catch (error) {
        res.status(500).json(error)
    }
}

router.post('/register', register);
router.post('/login', login);

export default router;

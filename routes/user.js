import express from "express";
import {verifyToken, verifyTokenAndAuthtorization, verifyTokenAndAdmin} from './verifyToken.js';
import User from "../models/User.js";

const router = express.Router();

// UPDATE USER
async function updateUser(req, res) {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET,
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

//DELETE USER
async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...")
    } catch (error) {
        res.status(500).json(error)
    }
}

//GET USER
async function getUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        // remove password from response
        const {password, ...others} = user._doc;

        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error)
    }
}

//GET ALL USERS
async function getUsers(req, res) {
    const query = req.query.new;

    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET USER STATS
async function getStats(req, res) {
    const date = new Date();

    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: {$gte: lastYear},
                },
            },
            {
                $project: {
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                }
            },
        ]);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json(error);
    }


}

router.put('/:id', verifyTokenAndAuthtorization, updateUser);
router.delete('/:id', verifyTokenAndAdmin, deleteUser);
router.get('/find/:id', verifyTokenAndAdmin, getUser);
router.get('/', verifyTokenAndAdmin, getUsers);
router.get('/stats', verifyTokenAndAdmin, getStats)

export default router;


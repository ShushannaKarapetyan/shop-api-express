import express from "express";
import {verifyToken, verifyTokenAndAuthtorization, verifyTokenAndAdmin} from './verifyToken.js';
import Cart from "../models/cart.js"

const router = express.Router();

// CREATE CART
async function createCart(req, res) {
    const cart = new Cart(req.body);

    try {
        const savedCart = await new Cart(cart).save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
}

// UPDATE CART
async function updateCart(req, res) {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error)
    }
}

// DELETE CART
async function deleteCart(req, res) {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted successfully.");
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET CART
async function getCart(req, res) {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET ALL CARTS OF ALL USERS
async function getCarts(req, res) {
    try {
        const carts = Cart.find();

        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error)
    }
}

router.post('/', verifyToken, createCart);
router.put('/:id', verifyTokenAndAuthtorization, updateCart);
router.delete('/:id', verifyTokenAndAuthtorization, deleteCart);
router.get('/find/:userId', verifyTokenAndAuthtorization, getCart);
router.get('/', verifyTokenAndAdmin, getCarts); // admin can see all carts of all users

export default router;
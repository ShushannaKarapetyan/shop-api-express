import express from "express";
import {verifyToken, verifyTokenAndAuthtorization, verifyTokenAndAdmin} from './verifyToken.js';
import Order from "../models/Order.js"

const router = express.Router();

// CREATE ORDER
async function createOrder(req, res) {
    const order = new Order(req.body);

    try {
        const savedOrder = await new Order(order).save();
        res.status(200).json(savedOrder);

    } catch (error) {
        res.status(500).json(error);
    }
}

// UPDATE ORDER
async function updateOrder(req, res) {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error)
    }
}

// DELETE ORDER
async function deleteOrder(req, res) {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted successfully.");
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET USER ORDERS
async function getCart(req, res) {
    try {
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET ALL ORDERS OF ALL USERS
async function getOrders(req, res) {
    try {
        const orders = Order.find();

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET MONTHLY INCOME
async function getIncome(req, res) {
    try {
        const date = new Date();
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
        const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

        const income = Order.aggregate([
            {
                $match: {
                    createdAt: {$gte: prevMonth}
                },
            },
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"},
                },
            }
        ]);

        res.status(200).json(income);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

router.post('/', verifyToken, createOrder);
router.put('/:id', verifyTokenAndAdmin, updateOrder);
router.delete('/:id', verifyTokenAndAdmin, deleteOrder);
router.get('/find/:userId', verifyTokenAndAuthtorization, getCart);
router.get('/', verifyTokenAndAdmin, getOrders); // admin can see all order of all users
router.get('/income', verifyTokenAndAdmin, getIncome)

export default router;
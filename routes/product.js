import express from "express";
import {verifyTokenAndAdmin} from './verifyToken.js';
import Product from "../models/Product.js"

const router = express.Router();

// CREATE PRODUCT
async function createproduct(req, res) {
    const product = new Product(req.body);

    try {
        const savedProduct = await new Product(product).save();
        res.status(200).json(savedProduct);

    } catch (error) {
        res.status(500).json(error);
    }
}

// UPDATE PRODUCT
async function updateProduct(req, res) {
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

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error)
    }
}

// DELETE PRODUCT
async function deleteProduct(req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted successfully.");
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET PRODUCT
async function getProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error)
    }
}

// GET ALL PRODUCTS
async function getProducts(req, res) {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({createdAt: -1}).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error)
    }
}

router.post('/', verifyTokenAndAdmin, createproduct);
router.put('/:id', verifyTokenAndAdmin, updateProduct);
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);
router.get('/find/:id', verifyTokenAndAdmin, getProduct);
router.get('/', verifyTokenAndAdmin, getProducts);

export default router;
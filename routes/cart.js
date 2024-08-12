const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    console.log(req.body);

    try {
        const cart = await Cart.findOne({ userId: req.body.userId }).populate('products.productId');

        if (!cart) {
            return res.json({ products: [] });
        }
        console.log(cart.products);

        res.json({ products: cart.products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

router.post('/items', auth, async (req, res) => {
    try {
        const { productId, quantity, userId } = req.body;


        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            cart = new Cart({ userId: userId, products: [] });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart' });
    }
});

router.put('/items/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.user.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item' });
    }
});

router.delete('/items/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await Cart.findOne({ userId: req.user.userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

module.exports = router;
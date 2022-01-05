import express from "express";
import stripe from "stripe";

const router = expres.Router();
const stripe = stripe(process.env.STRIPE_KEY);

function payment(req, res) {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "USD",
        },
        (stripeError, stripeResponse) => {
            if (stripeError) {
                res.status(500).json(stripeError),
            } else {
                res.status(200).json(stripeResponse),
            }
        }
    )
}

router.post('/payment', payment);
export default router;
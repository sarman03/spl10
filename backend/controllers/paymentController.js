import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
import axios from "axios";

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  
  try {
    const order = await instance.orders.create(options);
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userData } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      // Save payment details to database
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Send success response
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id
      });
    } catch (error) {
      console.error("Error saving payment:", error);
      res.status(500).json({
        success: false,
        message: "Payment verified but failed to save details",
        error: error.message
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};

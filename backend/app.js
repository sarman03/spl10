import express from "express";
import { config } from "dotenv";
import paymentRoute from "./routes/paymentRoutes.js";
import cors from "cors";
config({ path: "./config/config.env" });

export const app = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://spl10.netlify.app'], // Add your Netlify domain
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", paymentRoute);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

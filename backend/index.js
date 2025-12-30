import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));

// db connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("BD Connected successfully."))
  .catch((error) => console.log("Failed to connect to DB:", error));

app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

app.get("/", async (request, result) => {
  result.status(200).json({
    message: "Welcome to OU Task Management Backend API v1",
  });
});

// http:localhost:500/api-v1/
app.use("/api-v1", routes);

//error middleware
app.use((error, request, result, next) => {
  console.log(error.stack);
  result.status(500).json({ message: "Internal server error" });
});

// not found middleware
app.use((request, result) => {
  result.status(404).json({
    message: "Not found",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

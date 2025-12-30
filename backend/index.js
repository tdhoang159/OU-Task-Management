import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

// --- PHẦN ĐIỀU CHỈNH CORS ---
// Khi chạy production, process.env.FRONTEND_URL sẽ là link S3 của bạn
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Nếu chưa có domain S3, dùng "*" để test nhanh
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Thêm cái này nếu sau này bạn dùng Cookie/Session
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Thêm để xử lý dữ liệu từ form nếu cần

// --- KẾT NỐI DATABASE ---
// Đảm bảo bạn đã whitelist IP của EC2 trên MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected successfully."))
  .catch((error) => console.log("Failed to connect to DB:", error));

const PORT = Number(process.env.PORT) || 5000;

app.get("/", async (request, result) => {
  result.status(200).json({
    message: "Welcome to OU Task Management Backend API v1",
    status: "Healthy", // Thêm để sau này AWS Load Balancer kiểm tra server
  });
});

// Routes
app.use("/api-v1", routes);

// Error middleware
app.use((error, request, result, next) => {
  console.error(error.stack); // Dùng console.error để phân biệt lỗi
  result.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : {} // Ẩn lỗi chi tiết khi ở production
  });
});

// Not found middleware
app.use((request, result) => {
  result.status(404).json({
    message: "Route not found",
  });
});

// --- LẮNG NGHE CỔNG ---
// "0.0.0.0" là cực kỳ quan trọng để EC2 có thể nhận traffic từ bên ngoài qua Nginx
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import userRouter from "./src/modules/user/user.routes.js";
import dotenv from "dotenv";
import paymentRouter from './src/modules/payment/payment.routs.js';
import cors from "cors";
import { PrismaClient } from '@prisma/client'; // استيراد PrismaClient

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

// إنشاء اتصال Prisma
const prisma = new PrismaClient();

async function main() {
  try {
    // تحقق من الاتصال بقاعدة البيانات
    await prisma.$connect();
    console.log('✅ Connected to the database successfully');

    // API
    // user
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/payment", paymentRouter);  // إضافة المسارات الخاصة بالدفع


    // مسار الخطأ 404
    app.all("*", (req, res) => {
      res.status(404).json({ message: "NOT FOUND" });
    });

    // معالجة الأخطاء
    app.use((error, req, res, next) => {
      const statusCode = error.cause || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        stack: error.stack,
      });
    });

    // بدء الاستماع على المنفذ
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
  } finally {
    // يمكنك إغلاق اتصال Prisma إذا لم تعد بحاجة إليه
    await prisma.$disconnect();
  }
}

main(); // استدعاء الدالة الرئيسية لبدء التطبيق

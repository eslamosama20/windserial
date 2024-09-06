/*
  Warnings:

  - You are about to drop the column `created_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expired_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `is_valid` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `confirmpassword` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "created_at",
DROP COLUMN "expired_at",
DROP COLUMN "is_valid",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "isValid" BOOLEAN DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "token" SET DATA TYPE TEXT,
ALTER COLUMN "agent" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "confirmpassword",
ADD COLUMN     "confirmPassword" TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

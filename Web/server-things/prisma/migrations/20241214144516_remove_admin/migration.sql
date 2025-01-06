/*
  Warnings:

  - The values [admin] on the enum `Account_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `account` MODIFY `role` ENUM('author', 'user') NOT NULL;

-- AlterTable
ALTER TABLE `account` ADD COLUMN `verificationToken` VARCHAR(191) NULL,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT false;

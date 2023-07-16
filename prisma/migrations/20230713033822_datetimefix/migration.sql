/*
  Warnings:

  - Made the column `criado_em` on table `boletos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `criado_em` on table `lotes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "boletos" ALTER COLUMN "criado_em" SET NOT NULL,
ALTER COLUMN "criado_em" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "lotes" ALTER COLUMN "criado_em" SET NOT NULL;

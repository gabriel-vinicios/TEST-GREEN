-- DropForeignKey
ALTER TABLE "boletos" DROP CONSTRAINT "boletos_id_lote_fkey";

-- AlterTable
ALTER TABLE "boletos" ALTER COLUMN "id_lote" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "lotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

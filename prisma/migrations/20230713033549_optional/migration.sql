-- AlterTable
ALTER TABLE "boletos" ALTER COLUMN "nome_sacado" DROP NOT NULL,
ALTER COLUMN "valor" DROP NOT NULL,
ALTER COLUMN "linha_digitavel" DROP NOT NULL,
ALTER COLUMN "ativo" DROP NOT NULL,
ALTER COLUMN "criado_em" DROP NOT NULL;

-- AlterTable
ALTER TABLE "lotes" ALTER COLUMN "nome" DROP NOT NULL,
ALTER COLUMN "ativo" DROP NOT NULL,
ALTER COLUMN "criado_em" DROP NOT NULL;

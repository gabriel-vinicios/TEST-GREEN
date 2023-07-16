import { Request, Response } from 'express'
import { Readable } from 'stream'
import { ReadLine, createInterface } from 'node:readline'
import { client } from '../database/prismaClient'
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import { PDFDocument as pdfObj } from 'pdf-lib/cjs/api';
import fs from 'fs';
import path from 'path';
import { Boleto } from '../Interfaces/BoletosInterface';

export class BoletoController {
    async create(request: Request, response: Response) {
        const { file } = request

        const readableFile = new Readable()
        readableFile.push(file?.buffer)
        readableFile.push(null)

        const productsLine = createInterface({
            input: readableFile

        })

        const boletos: Boleto[] = []

        for await (let line of productsLine) {
            const productLineSplit = line.split(";")

            const loteId = await client.lotes.findFirst({
                where: {
                    nome: productLineSplit[0]
                },
            })


            boletos.push({
                nomeSacado: productLineSplit[0],
                unidade: Number(productLineSplit[1]) || 0,
                valor: Number(productLineSplit[2]) || 0,
                linhaDigitavel: productLineSplit[3],
                idLote: Number(loteId?.id)
            })
        }
        const boletosFormatted = boletos.slice(1)

        for await (let
            { nomeSacado, unidade, valor, linhaDigitavel, idLote } of boletosFormatted) {
            console.log({ nomeSacado, unidade, valor, linhaDigitavel, idLote })

            await client.boletos.create({
                data: {
                    nome_sacado: nomeSacado,
                    valor: valor,
                    linha_digitavel: linhaDigitavel,
                    lote: {
                        connect: {
                            id: idLote
                        }
                    },


                },
            })
        }
        return response.send(boletosFormatted)
    }


    async getBoletos(request: Request, response: Response) {
        const { nome, valor, id_lote, relatorio } = request.query

        const filters: any = {};

        if (nome) {
            filters.nome_sacado = { contains: String(nome) };
        }

        if (valor) {
            filters.valor = { ...filters.valor, lte: parseFloat(String(valor)) };
        }

        if (id_lote) {
            filters.id_lote = { equals: parseInt(String(id_lote)) };
        }

        const boletos = await client.boletos.findMany({ where: filters });

        if (String(relatorio) === "1") {
            const pdfPath = 'relatorio.pdf';
            const pdf = new PDFDocument();
      
            const stream = fs.createWriteStream(pdfPath);
            pdf.pipe(stream);
      
            pdf.fontSize(24).text('Relatório de Boletos');
      
            pdf.moveDown();
      
            const table = {
              headers: ['ID', 'Nome Sacado', 'ID Lote', 'Valor', 'Linha Digitável'],
              rows: boletos.map((boleto) => [
                boleto.id.toString(),
                boleto.nome_sacado,
                Number(boleto.id_lote).toString(),
                Number(boleto.valor).toString(),
                boleto.linha_digitavel,
              ]),
            };
      
            pdf.table(table, {
              prepareHeader: () => pdf.font('Helvetica-Bold'),
              prepareRow: () => pdf.font('Helvetica'),
              width: 400,
              align: 'center',
              border: true,
              fillColor: '#eeeeee',
              strokeColor: '#000000',
              headerBackgroundColor: '#dddddd',
            });
      
            pdf.end();
      
            stream.on('finish', () => {
              response.download(pdfPath, 'relatorio.pdf', () => {
                fs.unlinkSync(pdfPath);
              });
            });
        }


        return response.json(boletos);
    }

    async importPdf(request: Request, response: Response) {
        console.log(request.file)

        const filePath = 'uploads/TESTEGREEN.pdf';

        if (!fs.existsSync(filePath)) {
            return response.status(400).json({ error: 'Nenhum arquivo encontrado' });
        }

        const pdfBytes = fs.readFileSync(filePath);

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pageCount = pdfDoc.getPageCount();

        for (let i = 0; i < pageCount; i++) {
            const newPdfDoc = await PDFDocument.create();
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(copiedPage);

            const newPdfBytes = await newPdfDoc.save();
            const newFilePath = `uploads/page_${i + 1}.pdf`;
            fs.writeFileSync(newFilePath, newPdfBytes);
        }

        fs.unlinkSync(filePath);

        response.status(200).json({ message: 'Arquivo PDF dividido com sucesso' });
    }
}

import { Request, Response } from 'express';
import * as fs from 'fs';
import * as Excel from 'exceljs';
import { responseHttpService } from './responseHttp';

export const generateExcel = async (req: Request, res: Response) => {
  try {
    const workbook = new Excel.Workbook();
    const items = req?.body?.list;
    const worksheet = workbook.addWorksheet(`Hoja${new Date()?.toISOString()?.split('T')[0]}`);
    worksheet.columns = [
      { header: 'Item', key: 'item', width: 30 },
      { header: 'Valor', key: 'valor', width: 30 },
    ];
    worksheet.addRow(`FECHA DE ENSAYO ${new Date()?.toISOString()?.split('T')[0]}`);
    for (const iterator of items) {
      worksheet.addRow({ item: iterator?.id, valor: iterator?.value });
    }
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Disposition', 'attachment; filename=ejemplo.xlsx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    return responseHttpService(
      200,
      Buffer.from(buffer)?.toString('base64'),
      'archivo creado',
      true,
      res
    );
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
};

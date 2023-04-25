import { Request, Response } from 'express';
import * as fs from 'fs';
import * as Excel from 'exceljs';
import { responseHttpService } from './responseHttp';

export const generateExcel = async (req: Request, res: Response) => {
  try {
    // Crea un nuevo libro de Excel
    const workbook = new Excel.Workbook();

    const items = req?.body?.list;

    // Agrega una hoja al libro de Excel
    const worksheet = workbook.addWorksheet(`Hoja${new Date()?.toISOString()?.split('T')[0]}`);

    // Agrega encabezados a la hoja
    worksheet.columns = [
      { header: 'Item', key: 'item', width: 30 },
      { header: 'Valor', key: 'valor', width: 30 },
    ];

    // Agrega filas a la hoja
    const list = [
      { name: 'Juan', age: 25 },
      { name: 'María', age: 30 },
      { name: 'Pedro', age: 40 },
    ];
    for (const iterator of items) {
      worksheet.addRow({ item: iterator?.id, valor: iterator?.value });
    }

    // Genera el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    // Envía el archivo Excel al frontend
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

import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Formula from '../models/Formula';

export async function crearFormula(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const formula = new Formula({
      Nombre: req?.body?.nombre,
      Informacion: true,
      ArchivoVentas: req?.body?.archivoVentasId,
      ArchivoCosto: req?.body?.archivoCostoId,
    });
    await formula.save();
    return responseHttpService(200, 'Formula creada creada', '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}


export async function obtenerListadoFormulas(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const listado = await Formula.find({}).sort({ FechaCreacion: -1 });
    return responseHttpService(200, listado, '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}
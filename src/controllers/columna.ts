import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Columna from '../models/Columna';

export async function crearColumna(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const columna = new Columna({
      Nombre: req?.body?.nombre?.toUpperCase(),
    });
    await columna.save();
    return responseHttpService(200, 'Columna creada', '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}
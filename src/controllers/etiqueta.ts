import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Etiqueta from '../models/Etiqueta';

export async function crearEtiqueta(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const etiqueta = new Etiqueta({
      Nombre: req?.body?.name,
      Status: true,
      Color: req?.body?.color,
    });
    await etiqueta.save();
    return responseHttpService(200, 'Etiqueta creada', '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Obra from '../models/Obra';

export async function crearObra(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const obra = new Obra({
      Nombre: req?.body?.name,
      Status: true,
    });
    await obra.save();
    return responseHttpService(200, 'Obra creada', '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

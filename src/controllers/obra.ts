import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Obra from '../models/Obra';

export async function crearObra(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const obra = new Obra({
      Nombre: req?.body?.name,
      Estado: true,
    });
    await obra.save();
    return responseHttpService(200, 'Obra creada', '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export async function actualizarObra(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const estado = req?.body?.nuevoEstado;
    const nuevaObra = await Obra?.findOneAndUpdate(
      { _id: req?.params?.idobra },
      {
        Estado: estado,
      },
      { new: true }
    );
    return responseHttpService(200, nuevaObra, '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export async function obtenerListadoObras(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const obras = await Obra?.find({ Estado: true });
    return responseHttpService(200, obras, '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

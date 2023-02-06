import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Etiqueta from '../models/Etiqueta';

export async function crearEtiqueta(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const etiqueta = new Etiqueta({
      Nombre: req?.body?.nombre,
      Estado: true,
      Color: req?.body?.color,
    });
    await etiqueta.save();
    return responseHttpService(200, 'Etiqueta creada', '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export async function actualizarEtiqueta(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const etiqueta = req?.body;
    const nuevaEtiqueta = await Etiqueta?.findOneAndUpdate(
      { _id: req?.params?.idetiqueta },
      etiqueta,
      { new: true }
    );
    return responseHttpService(200, nuevaEtiqueta, '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export async function obtenerListadoEtiquetas(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const etiquetas = await Etiqueta?.find({})?.sort({ FechaCreacion: -1 });
    return responseHttpService(200, etiquetas, '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

import TipoArchivo from '../models/TipoArchivo';
import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';

export async function crearTipoArchivo(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const tipoArchivo = new TipoArchivo({
      Nombre: req?.body?.nombre?.toUpperCase(),
    });
    const existePrevio = await TipoArchivo?.findOne({ Nombre: req?.body?.nombre });
    if (existePrevio) {
      return responseHttpService(400, null, 'Ya existe un archivo con ese nombre', false, res);
    }
    await tipoArchivo.save();
    return responseHttpService(200, 'Tipo Archivo Creado', '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export async function ObtenerListadoTiposArchivo(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const listadoTipoArchivo = await TipoArchivo?.find({})?.sort({FechaCreacion: -1});
    return responseHttpService(200, listadoTipoArchivo, '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}
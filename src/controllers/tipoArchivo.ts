import { TIPO_ARCHIVO_LISTA } from '../constants/tipoArchivo.constant';
import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';


export async function ObtenerListadoTiposArchivo(req: any, res: any): Promise<ResponseHttpService> {
  try {
    return responseHttpService(200, TIPO_ARCHIVO_LISTA, '', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}
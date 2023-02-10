import excelToJson from 'convert-excel-to-json';
import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Archivo from '../models/Archivo';
import { ItemArchivo } from '..//interfaces/Archivo';

export async function crearArchivo(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const archivoEnBuffer = Buffer.from(req?.body?.srcArchivo, 'base64');
    const infoArchivo = construccionInformacion(archivoEnBuffer);

    const mapModelo = {
      Nombre: req?.body?.nombre?.toUpperCase(),
      Mes: req?.body?.mes,
      Ano: req?.body?.ano,
      Obra: req?.body?.obra,
      Informacion: infoArchivo,
    };

    const archivo = new Archivo(mapModelo);
    await archivo.save();
    return responseHttpService(200, infoArchivo, 'Archivo creado', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export async function obtenerArchivoFiltro(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const filtro = {
      Ano: req?.body?.ano,
      Mes: req?.body?.mes,
      Obra: req?.body?.obra,
      Nombre: req?.body?.nombre?.toUpperCase(),
    };
    const filtroLimpio = cleanQuery(filtro);
    const listArchivos = await Archivo.find(filtroLimpio);
    if (listArchivos?.length > 0) {
      return responseHttpService(200, listArchivos, '', true, res);
    }
    return responseHttpService(400, null, 'No se encontraron datos', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export function construccionInformacion(fileInfo: Buffer): ItemArchivo[] {
  const result = excelToJson({
    source: fileInfo,
  });
  const hojaInformacion = result['Hoja 2'];
  const max = obtenerMaximoColumnas(hojaInformacion);
  const miListadoConValores = hojaInformacion?.filter((it) => Object.keys(it)?.length === max);
  const [nombreColumnas] = miListadoConValores;

  const registros = miListadoConValores?.splice(1);
  const registroCompleto: ItemArchivo[] = [];
  registroCompleto.push(nombreColumnas);
  for (const registro of registros) {
    let registroItemModel = {};
    for (const key in nombreColumnas) {
      if (Object.prototype.hasOwnProperty.call(nombreColumnas, key)) {
        registroItemModel = { ...registroItemModel, [key]: `${registro[key]}` };
      }
    }
    registroCompleto.push(registroItemModel);
  }
  return registroCompleto;
}

function obtenerMaximoColumnas(listaInfomacion: any[]): number {
  let max = 0;
  for (const iterator of listaInfomacion) {
    const current = Object.keys(iterator)?.length;
    if (current > max) {
      max = current;
    }
  }
  return max;
}

function removerCaracteres(texto: string): string {
  const textoSinAcentos = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return textoSinAcentos?.toUpperCase();
}
function cleanQuery(obj: any) {
  const MES_GENERICO_TODOS = 13131313;
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === '' ||
      obj[propName] === MES_GENERICO_TODOS
    ) {
      delete obj[propName];
    }
  }
  return obj;
}

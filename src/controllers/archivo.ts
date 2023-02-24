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
    const listArchivos = await Archivo.find(filtroLimpio)?.populate('Obra');
    if (listArchivos?.length > 0) {
      return responseHttpService(200, listArchivos, '', true, res);
    }
    return responseHttpService(400, null, 'No se encontraron datos', true, res);
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export function construccionInformacion(fileInfo: Buffer): any {
  const result = excelToJson({
    source: fileInfo,
  });
  const hojaInformacion = result[obtenerNombreHoja(result)];
  const max = obtenerMaximoColumnas(hojaInformacion);
  const miListadoConValores: any = hojaInformacion?.filter((it) => Object.keys(it)?.length === max);
  // Construccion de cabeceras
  const cabeceras: { columna: string; nombre: string }[] = [];
  const [cabecerasObj] = miListadoConValores;
  for (const key in cabecerasObj) {
    if (Object.prototype.hasOwnProperty.call(cabecerasObj, key)) {
      cabeceras.push({ columna: key, nombre: `${removerCaracteres(cabecerasObj[key])}` });
    }
  }

  // Formatear registros
  const registrosFormateados = [];
  const registros = miListadoConValores?.splice(1);
  for (const registro of registros) {
    let registroConcat = {};
    for (const key in registro) {
      if (Object.prototype.hasOwnProperty.call(registro, key)) {
        const cabecera: any = cabeceras.find((it) => it?.columna === key);
        const element = registro[key];

        registroConcat = {
          ...registroConcat,
          [cabecera?.nombre]: removerCaracteres(element),
          letra: key,
        };
      }
    }
    registrosFormateados.push(registroConcat);
  }

  // Ordenar los registros
  let listadoOrdenado: any[] = registrosFormateados?.sort(
    (itA: any, itB: any) => +itA?.codigo - +itB?.codigo
  );
  // Mapeo
  const listaDefinitiva: any[] = [];
  for (let index = 0; index < listadoOrdenado.length; index++) {
    const element = listadoOrdenado[index];
    const childrens = listadoOrdenado?.filter((it: any) => it?.CODIGO?.includes(element?.CODIGO));
    listadoOrdenado = listadoOrdenado.filter((it: any) => !it?.CODIGO?.includes(element?.CODIGO));
    listaDefinitiva.push({
      data: {
        nombre: element?.NOMBRE,
        codigo: element?.CODIGO,
        consolidado: element?.CONSOLIDADO,
        etiqueta: null,
      },
      children: [
        ...childrens.map((it) => ({
          data: {
            nombre: it?.NOMBRE,
            codigo: it?.CODIGO,
            consolidado: it?.CONSOLIDADO,
            etiqueta: null,
          },
        })),
      ],
    });
  }
  return listaDefinitiva;
}

function obtenerNombreHoja(info: any): string {
  return Object.keys(info)[Object.keys(info)?.length - 1];
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

function removerCaracteres(texto: string = ''): string {
  try {
    if (typeof texto === 'number') {
      return `${texto}`;
    }
    const textoSinAcentos = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return textoSinAcentos?.toUpperCase();
  } catch (error) {
    return texto;
  }
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

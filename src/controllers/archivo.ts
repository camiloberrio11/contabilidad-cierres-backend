import excelToJson from 'convert-excel-to-json';
import { responseHttpService } from '../helpers/responseHttp';
import { ResponseHttpService } from '../interfaces/HttpResponse';
import Archivo from '../models/Archivo';
import { encontrarPapaId } from '../helpers/archivo';
import { FieldArchivo } from 'src/interfaces/ItemArchivo';

type TIPO_ARCHIVO = 'VENTAS' | 'COSTOS';

export async function crearArchivo(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const archivoEnBuffer = Buffer.from(req?.body?.srcArchivo, 'base64');
    let existePlantilla = false;
    const informacion = await Archivo.findOne({
      Obra: req?.body?.obra,
      TipoArchivo: req?.body?.tipoArchivo,
      EsPlantilla: true,
    });

    if (req?.body?.esPlantilla) {
      // Pasar todo a false
      await Archivo.updateMany(
        { EsPlantilla: true, Obra: req?.body?.obra, TipoArchivo: req?.body?.tipoArchivo },
        { EsPlantilla: false }
      );
      existePlantilla = req?.body?.esPlantilla;
    }

    if (!informacion) {
      existePlantilla = true;
    }

    const actualPlantilla: any = await Archivo.findOne({
      Obra: req?.body?.obra,
      TipoArchivo: req?.body?.tipoArchivo,
      EsPlantilla: true,
    });

    const infoArchivo = await construccionInformacion(
      archivoEnBuffer,
      req?.body?.obra,
      req?.body?.tipoArchivo,
      actualPlantilla?.Informacion || []
    );


    const mapModelo = {
      Nombre: req?.body?.nombre?.toUpperCase(),
      Mes: req?.body?.mes,
      Ano: req?.body?.ano,
      Obra: req?.body?.obra,
      Informacion: infoArchivo,
      EsPlantilla: existePlantilla,
      TipoArchivo: req?.body?.tipoArchivo,
    };

    const archivo = new Archivo(mapModelo);
    const item = await archivo.save();

    return responseHttpService(200, infoArchivo, `${item?._id}`, true, res);
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

export async function construccionInformacion(
  fileInfo: Buffer,
  typeFile: TIPO_ARCHIVO,
  plantilla: any[]
): Promise<FieldArchivo[]> {
  const result = excelToJson({
    source: fileInfo,
  });

  if (typeFile === 'VENTAS') {
    const resultadoArchivo = getInfoFile(result['pyg']);
    return resultadoArchivo;
  }

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
          [removerCaracteres(cabecera?.nombre)]: removerCaracteres(element),
          LETRA: key,
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


  const listaDefinitiva: FieldArchivo[] = [];
  for (const iterator of listadoOrdenado) {
    const plantillaLimpia = JSON.parse(JSON.stringify(plantilla));
    const etiquetaPlantilla = plantillaLimpia?.find((it: any) => it?.data?.codigo === iterator?.CODIGO) || null;
    listaDefinitiva.push({
      data: {
        nombre: iterator?.NOMBRE,
        codigo: iterator?.CODIGO,
        consolidado: iterator?.CONSOLIDADO,
        etiqueta: etiquetaPlantilla?.data?.etiqueta || null,
        papaId: encontrarPapaId(iterator?.CODIGO, listadoOrdenado) || null,
      },
    });
  }
  return listaDefinitiva;
}

export async function asignarEtiqueta(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const id = req.body?.codigo;
    const idArchivo = req?.body?.idArchivo;
    const etiqueta = req?.body?.etiqueta;
    const archivoInfo = await Archivo.findOne({ _id: idArchivo });
    if (!archivoInfo) {
      return responseHttpService(400, null, 'Archivo no encontrado', true, res);
    }

    let newInformation = [];

    if (archivoInfo.TipoArchivo === 'VENTAS') {
      const otros = archivoInfo.Informacion?.filter((it) => it.data.codigo !== id);
      const info = archivoInfo.Informacion?.find((it) => it.data.codigo === id);
      newInformation = [...otros];
      newInformation.push({ data: { ...info?.data, etiqueta } });
    } else {
      for (const iterator of archivoInfo.Informacion) {
        if (iterator?.data.codigo?.startsWith(id)) {
          const newData = { ...iterator.data, etiqueta };
          newInformation.push({ data: newData });
          continue;
        }
        newInformation.push(iterator);
      }
    }

    newInformation = newInformation.sort((a, b) => +a.data.codigo - +b.data.codigo);

    const fileUpdated = await Archivo.findOneAndUpdate(
      { _id: idArchivo },
      { Informacion: newInformation },
      { new: true }
    );

    return responseHttpService(
      200,
      JSON.parse(JSON.stringify(fileUpdated?.Informacion)),
      'Archivo actualizado',
      true,
      res
    );
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
}

export async function eliminarRegistroEnArchivo(req: any, res: any): Promise<ResponseHttpService> {
  try {
    const id = req.body?._id;
    const idRegistro = req.body?.idRegistro;

    const archivoInfo = await Archivo.findOne({ _id: id });
    if (!archivoInfo) {
      return responseHttpService(400, null, 'Archivo no encontrado', true, res);
    }
    let newInformation = [];

    for (const iterator of archivoInfo.Informacion) {
      if (iterator?.data.codigo?.startsWith(idRegistro)) {
        continue;
      }
      newInformation.push(iterator);
    }

    // Que pasa con los hijos, huerfanos ???
    const archivoActualizado = await Archivo.findByIdAndUpdate(
      { _id: id },
      { Informacion: newInformation },
      { new: true }
    );
    return responseHttpService(
      200,
      JSON.parse(JSON.stringify(archivoActualizado?.Informacion)),
      'Archivo actualizado',
      true,
      res
    );
  } catch (error: any) {
    return responseHttpService(500, null, error?.message, false, res);
  }
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

function getInfoFile(info: any[]): FieldArchivo[] {
  const INDICE_INICIO_CABECERA = 7;
  const nuevo: FieldArchivo[] = [];
  for (let index = INDICE_INICIO_CABECERA; index < info.length; index++) {
    const element = info[index];
    console.log(element);
    if (!element?.B) {
      continue;
    }
    nuevo.push({
      data: {
        nombre: element?.B || '',
        consolidado: element?.O || '0',
        codigo: `${index - INDICE_INICIO_CABECERA}`,
        etiqueta: null,
        papaId: null,
      },
    });
  }
  return nuevo;
}

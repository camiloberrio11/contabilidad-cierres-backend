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

    const columna = new Archivo(mapModelo);
    await columna.save();
    return responseHttpService(200, infoArchivo, 'Archivo creado', true, res);
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
  // console.log(registroCompleto)
  // console.log(registroCompleto);
  // for (const key in nombreColumnas) {
  //   if (Object.prototype.hasOwnProperty.call(nombreColumnas, key)) {
  //     const nombre = nombreColumnas[key];
  //     for (const registro of registros) {
  //       console.log({ nombre, registro });
  //       const item = {[key]: registro[key]};
  //       listado.push(item);
  //     }
  //   }
  // }

  // const [nombreColumnas] = miListadoConValores;
  // const columnasValidas = [];
  // const columnasMapeadas = await Columna.find({});
  // for (const key in nombreColumnas) {
  //   if (Object.prototype.hasOwnProperty.call(nombreColumnas, key)) {
  //     const valorFormateado: string = removerCaracteres(`${nombreColumnas[key]}`);
  //     const existe = columnasMapeadas?.find((it) => it?.Nombre === valorFormateado);
  //     if (existe) {
  //       columnasValidas.push({ [key]: valorFormateado });
  //     }
  //   }
  // }
  // // delete miListadoConValores[0];
  // mapearEncabezadoConValores(columnasValidas, miListadoConValores?.splice(1));
}

// async function  mapearEncabezadoConValores(informacion: any[]) {
//   const ComunasEnDB = await Columna.find({});
//   const [encabezados] = informacion;
//   const datos = informacion?.splice(1);
//   for (const key in encabezados) {
//     if (Object.prototype.hasOwnProperty.call(encabezados, key)) {
//       const element = removerCaracteres(encabezados[key]);
//       const existe = ComunasEnDB?.find(it => it.Nombre === element?.toUpperCase());
//       if (existe) {
//         for (const iterator of datos) {
//           let registroItemModel = {}
//           for (const key in iterator) {
//             if (Object.prototype.hasOwnProperty.call(iterator, key)) {
//               registroItemModel = { ...registroItemModel, [key]: `${iterator[key]}` };
//             }
//           }
//           console.log(registroItemModel)
//         }

//       }
//     }
//   }
// }

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

// Services

import { Schema, model } from 'mongoose';
import Obra from './Obra';

export interface Prueba {}
// class Tester {
//   key: string;
//   value: string;

//   constructor(_key: string, _value: string) {
//     this.key = _key;
//     this.value = _value;
//   }
// }

const ArchivoSchema = new Schema({
  Nombre: {
    type: String,
    uppercase: true,
  },
  Mes: {
    type: String,
  },
  Ano: {
    type: String,
  },
  Obra: {
    type: Schema.Types.ObjectId,
    ref: Obra,
  },
  Informacion: [
    // {
    //   type: Tester,
    // },
    {type: Map, of: String}
  ],
  FechaCreacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
  FechaActualizacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
});

export default model('Archivo', ArchivoSchema);

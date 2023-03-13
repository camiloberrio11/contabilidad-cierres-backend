import { Schema, model } from 'mongoose';
import Obra from './Obra';
import TipoArchivo from './TipoArchivo';


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
  Informacion: [Schema.Types.Mixed],
  FechaCreacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
  FechaActualizacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
  EsPlantilla: {
    type: Boolean,
    default: false,
  },
  TipoArchivo: {
    type: Schema.Types.ObjectId,
    ref: TipoArchivo,
  },
});

export default model('Archivo', ArchivoSchema);

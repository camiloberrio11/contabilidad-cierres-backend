import { Schema, model } from 'mongoose';
import Archivo from './Archivo';

const FormulaSchema = new Schema({
  Nombre: {
    type: String,
  },
  Informacion: [Schema.Types.Mixed],
  ArchivoVentas: {
    type: Schema.Types.ObjectId,
    ref: Archivo,
  },
  ArchivoCosto: {
    type: Schema.Types.ObjectId,
    ref: Archivo,
  },
  FechaCreacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
});

export default model('Formula', FormulaSchema);

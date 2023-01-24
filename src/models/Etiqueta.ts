import { Schema, model } from 'mongoose';

const EtiquetaSchema = new Schema({
  Nombre: {
    type: String,
  },
  Estado: {
    type: Boolean,
  },
  FechaCreacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
  Color: {
    type: String,
  },
});

export default model('Etiqueta', EtiquetaSchema);

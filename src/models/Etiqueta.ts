import { Schema, model } from 'mongoose';

const EtiquetaSchema = new Schema({
  Nombre: {
    type: String,
  },
  Status: {
    type: Boolean,
  },
  FechaCreacion: {
    type: Date,
    default: Date.now,
  },
  Color: {
    type: String,
  },
});

export default model('Etiqueta', EtiquetaSchema);

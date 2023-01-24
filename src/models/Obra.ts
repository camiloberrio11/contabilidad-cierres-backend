import { Schema, model } from 'mongoose';

const ObraSchema = new Schema({
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
});

export default model('Obra', ObraSchema);

import { Schema, model } from 'mongoose';

const ObraSchema = new Schema({
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
});

export default model('Obra', ObraSchema);

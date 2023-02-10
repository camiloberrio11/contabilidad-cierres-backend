
import { Schema, model } from 'mongoose';

const ColumnaSchema = new Schema({
  Nombre: {
    type: String,
    uppercase: true
  },
  FechaCreacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
});

export default model('Columna', ColumnaSchema);

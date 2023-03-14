
import { Schema, model } from 'mongoose';

const TipoArchivoSchema = new Schema({
  Nombre: {
    type: String,
    uppercase: true
  },
  IdentificadorSecreto: {
    type: String,
    uppercase: true
  },
  FechaCreacion: {
    type: Date,
    default: new Date()?.toISOString(),
  },
});

export default model('TipoArchivo', TipoArchivoSchema);

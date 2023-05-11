export interface FieldArchivo {
  data: {
    nombre: string;
    codigo: string;
    consolidado: string;
    etiqueta: {
      _id: string;
      Nombre: string;
      Estado: boolean;
      FechaCreacion: string;
      Color: string;
    } | null;
    papaId: string | null;
  };
}

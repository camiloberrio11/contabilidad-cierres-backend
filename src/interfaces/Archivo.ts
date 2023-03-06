export interface ItemArchivo {
  [key: string]: string;
}

export interface RegistroArchivo {
  data: ItemRegistroArchivo;
  children: {
    data: ItemRegistroArchivo;
  }[];
}

export interface ItemRegistroArchivo {
  nombre: string;
  codigo: string;
  consolidado: string;
  color?: string;
  children: {
    data: ItemRegistroArchivo;
  }[];
}

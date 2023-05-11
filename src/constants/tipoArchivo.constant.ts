interface TipoArchivo {
  id: number;
  tipo: TIPO_ARCHIVO;
}
type TIPO_ARCHIVO = 'VENTAS' | 'COSTOS';
export const TIPO_ARCHIVO_LISTA: TipoArchivo[] = [
  { id: 0, tipo: 'VENTAS' },
  { id: 1, tipo: 'COSTOS' },
];

export function encontrarPapaId(idbuscar: string, listadoItems: any[]) {
  const lista = listadoItems;
  let maxCoincidencia = '';
  let papa;
  for (let i = 0; i < lista.length; i++) {
    if (idbuscar.includes(lista[i]?.CODIGO)) {
      if (lista[i].CODIGO.startsWith(maxCoincidencia)) {
        if (lista[i].CODIGO === idbuscar) {
          if (!lista[i -1]) {
            return null;
          }
          papa = maxCoincidencia ? maxCoincidencia : lista[i].CODIGO;
          break;
        }
        maxCoincidencia = lista[i].CODIGO;
        papa = lista[i - 1]?.CODIGO;
      }
    }
  }
  return papa;
}

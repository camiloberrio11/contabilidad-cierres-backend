import { Router } from 'express';
import { actualizarObra, crearObra, obtenerListadoObras } from '../controllers/obra';
import {
  actualizarEtiqueta,
  crearEtiqueta,
  obtenerListadoEtiquetas,
} from '../controllers/etiqueta';
import { crearColumna } from '../controllers/columna';
import { crearArchivo, obtenerArchivoFiltro } from '../controllers/archivo';

export const router = Router();

router.post('/obra', crearObra);
router.put('/obra/:idobra', actualizarObra);
router.get('/obras', obtenerListadoObras);

router.post('/etiqueta', crearEtiqueta);
router.put('/etiqueta/:idetiqueta', actualizarEtiqueta);
router.get('/etiquetas', obtenerListadoEtiquetas);

router.post('/columna', crearColumna);

router.post('/archivo', crearArchivo);
router.post('/obtenerarchivo', obtenerArchivoFiltro);

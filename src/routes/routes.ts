import { Router } from 'express';
import { actualizarObra, crearObra, obtenerListadoObras } from '../controllers/obra';
import {
  actualizarEtiqueta,
  crearEtiqueta,
  obtenerListadoEtiquetas,
} from '../controllers/etiqueta';
import { asignarEtiqueta, crearArchivo, eliminarRegistroEnArchivo, obtenerArchivoFiltro } from '../controllers/archivo';
import { ObtenerListadoTiposArchivo } from '../controllers/tipoArchivo';
import { generateExcel } from '../helpers/excel';
import { crearFormula, obtenerListadoFormulas } from '../controllers/formula';

export const router = Router();

router.post('/obra', crearObra);
router.put('/obra/:idobra', actualizarObra);
router.get('/obras', obtenerListadoObras);

router.post('/etiqueta', crearEtiqueta);
router.put('/etiqueta/:idetiqueta', actualizarEtiqueta);
router.get('/etiquetas', obtenerListadoEtiquetas);

router.post('/archivo', crearArchivo);
router.post('/obtenerarchivo', obtenerArchivoFiltro);
router.post('/asignaretiqueta', asignarEtiqueta);
router.post('/eliminarregistro', eliminarRegistroEnArchivo);

router.get('/tipoarchivo', ObtenerListadoTiposArchivo);

router.post('/formula', crearFormula);
router.get('/formulas', obtenerListadoFormulas);


router.post("/excel", generateExcel);




import { Router } from 'express';
import { crearObra } from '../controllers/obra';
import { crearEtiqueta } from '../controllers/etiqueta';

export const router = Router();

router.post('/obra', crearObra)
router.post('/etiqueta', crearEtiqueta)



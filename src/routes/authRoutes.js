import { Router } from 'express';
import { login, createInitialAdmin } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);

// Ruta solo para crear el primer admin en desarrollo. Luego puedes eliminarla o protegerla más.
router.post('/init-admin', createInitialAdmin);

export default router;

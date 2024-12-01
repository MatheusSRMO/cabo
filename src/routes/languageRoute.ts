import { Router } from 'express';
import languageController from '../controllers/languageController';

const router = Router();

router.post('/run', languageController.runCode);

router.get('/list', languageController.list);

export default router;

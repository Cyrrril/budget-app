import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authGuard } from "../middlewares/auth.guard";
import { validateLogin, validateRegister } from '../validators/auth.validator';

const router = Router();

router.post('/register', register, validateRegister);
router.post('/login', login, validateLogin);
router.get('/me', authGuard, (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
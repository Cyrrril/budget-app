import { Router } from 'express';
import { createBudget, getBudgetById, getBudgets, deleteBudget } from '../controllers/budget.controller';
import { validateCreateBudget, validateUpdateBudget } from '../validators/budget.validator';
import { authGuard } from '../middlewares/auth.guard';

const router = Router();

router.use(authGuard);
router.get('/', getBudgets);
router.get("/:id", getBudgetById);
router.post('/', createBudget, validateCreateBudget);
router.delete('/:id', deleteBudget);

export default router;
import express from 'express';
import {
  userSignUp,
  userLogin,
  getUsers,
  changeRole,
  deleteUser,
  restoreUser,
} from '../controllers/userController';
import { userSignupDetails } from '../interfaces/userData';
import { checkAccess } from '../middlewares/access';
const router = express.Router();

// User Routes
router.get('/', (req, res) => {
  res.send('Welcome to User Routes ');
});

router.post('/signup', checkAccess, (req, res) =>
  userSignUp(req as userSignupDetails, res)
);
router.post('/login', (req, res) => userLogin(req as userSignupDetails, res));
router.get('/all', checkAccess, (req, res) => getUsers(req as any, res));
router.put('/changeRole', checkAccess, (req, res) =>
  changeRole(req as any, res)
);
router.delete('/', checkAccess, (req, res) => deleteUser(req, res));

// Route for restoring a user
router.put('/restore', checkAccess, (req, res) => restoreUser(req, res));
export default router;

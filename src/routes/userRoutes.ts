import express from 'express';
import { userSignUp, userLogin } from '../controllers/userController';
import { userSignupDetails } from '../interfaces/userData';
import { logRequest } from '../middlewares/requestLog';
const router = express.Router();
//router.use(logRequest);
router.get('/', (req, res) => {
  res.send('Welcome to User Routes ');
});

router.post('/signup', (req, res) => userSignUp(req as userSignupDetails, res));
router.post('/login', (req, res) => userLogin(req as userSignupDetails, res));
export default router;

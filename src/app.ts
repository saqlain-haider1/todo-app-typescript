import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import { json } from 'sequelize';
import sequelize from './db/database';
import { logRequest } from './middlewares/requestLog';

sequelize
  .sync()
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch((err) => {
    console.log('Error: ', err.message);
  });

const app = express();

app.use(logRequest);
app.use(express.json());
app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});

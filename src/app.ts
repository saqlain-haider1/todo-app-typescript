import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/userRoutes';
import { json } from 'sequelize';
import sequelize from './db/database';

sequelize
  .sync()
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch((err) => {
    console.log('Error: ', err.message);
  });

const app = express();

app.use(express.json());
app.use('/user', userRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});

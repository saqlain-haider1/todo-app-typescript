import express from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from '../controllers/taskController';
import { TaskInfo, updateTaskInfo } from '../interfaces/taskInfo';
import { logRequest } from '../middlewares/requestLog';
const router = express.Router();
//router.use(logRequest);

// Route for creating a task
router.post('/', (req, res) => createTask(req as TaskInfo, res));

// Route for getting a task for a given user
router.get('/:userId', (req, res) => getTask(req, res));

// Route for updating a task
router.put('/:taskId', (req, res) =>
  updateTask(req as unknown as updateTaskInfo, res)
);

// Route for deleting a task
router.delete('/:taskId', (req, res) => deleteTask(req, res));

export default router;

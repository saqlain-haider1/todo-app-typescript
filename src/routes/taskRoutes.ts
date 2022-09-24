import express from 'express';
import {
  assignTask,
  createTask,
  deleteTask,
  getAllTasks,
  getAllTaskUser,
  importTask,
  restoreTask,
  searchTask,
  updateTask,
} from '../controllers/taskController';
import { TaskInfo, updateTaskInfo } from '../interfaces/taskInfo';
import { checkAccess } from '../middlewares/access';
import { logRequest } from '../middlewares/requestLog';
const router = express.Router();

// Route for creating a task
router.post('/', (req, res) => createTask(req as TaskInfo, res));

// Route for searching a task
router.get('/search', (req, res) => searchTask(req, res));

// Route for importing tasks from json file
router.get('/json', (req, res) => importTask(req, res));

// Route for getting a task for a given user
router.get('/:userId', (req, res) => getAllTaskUser(req, res));

// Route for getting all task (Admin only)
router.get('/', checkAccess, (req, res) => getAllTasks(req, res));

// Route for restoring a task
router.put('/restore', (req, res) => restoreTask(req, res));

// // Route for updating a task
// router.put('/:taskId', (req, res) =>
//   updateTask(req as unknown as updateTaskInfo, res)
// );

// Route for deleting a task
router.delete('/:taskId', (req, res) => deleteTask(req, res));

// Route for assigning a task to a user
router.put('/assign', checkAccess, (req, res) => assignTask(req, res));

export default router;

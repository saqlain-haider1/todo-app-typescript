import Task from '../models/Task';
import { Request, Response } from 'express';
import { TaskInfo, updateTaskInfo } from '../interfaces/taskInfo';
import { Op } from 'sequelize';
import User from '../models/User';
import { getTasksFromFile, sendEmail } from './utility';
import console from 'console';

/**
 *
 * @param req : TaskInfo object
 * @param res : Response object
 * @returns : Promise <{ message: string, Task: Task }>
 */
export const createTask = async (req: TaskInfo, res: Response) => {
  try {
    const { description, status = 0, userId } = req.body;
    let newTask = await Task.create({ userId, description, status });
    await newTask.save().then((task) => {
      console.log('Task created', task);
      return res.json({
        message: 'Task Created Successfuly! ',
        Task: newTask.toJSON(),
      });
    });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

/**
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise <{ 'Total Tasks': number, Tasks: Task[] }>
 */
export const getAllTaskUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limitVal = req.query.limit || 10;
    const offsetVal = req.query.offset || 1;
    const { count, rows } = await Task.findAndCountAll({
      where: { userId: userId },
      offset: +offsetVal,
      limit: +limitVal,
    });
    return res.json({ 'Total Tasks': count, Tasks: rows });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

/**
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise <{ 'Total Tasks': number, Tasks: Task[] }>
 */
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const limitVal = req.query.limit || 10;
    const offsetVal = req.query.offset || 1;
    const { count, rows } = await Task.findAndCountAll({
      offset: +offsetVal,
      limit: +limitVal,
    });
    return res.json({ 'Total Tasks': count, Tasks: rows });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

/**
 *
 * @param req updateTaskInfo object
 * @param res Response object
 * @returns Promise <Task>
 */
export const updateTask = async (req: updateTaskInfo, res: Response) => {
  try {
    const taskId = req.params?.taskId;
    const { description, status, userId } = req.body;
    if (taskId) {
      const task = await Task.findByPk(+taskId);
      if (task) {
        const updatedTask = await task.update({ description, status, userId });
        if (updatedTask) {
          res.json(updatedTask);
        }
      } else {
        throw new Error(`Task ${taskId} not found`);
      }
    } else {
      throw new Error('Task ID not specified');
    }
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

/**
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise <{ message: string }>
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params?.taskId;
    const { description, status, userId } = req.body;
    if (taskId) {
      const task = await Task.findByPk(+taskId);
      if (task) {
        await task.destroy();
        return res.json({ message: 'Task deleted successfully!' });
      } else {
        throw new Error('Task not found!');
      }
    } else {
      throw new Error('Task ID not specified');
    }
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

/**
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise <{ message: string, updatedTask: Task }>
 */
export const assignTask = async (req: Request, res: Response) => {
  try {
    const userToAssignEmail = req?.body.userToAssignEmail;
    const taskId = req?.body.taskId;
    if (userToAssignEmail && taskId) {
      let task = await Task.findByPk(taskId);
      if (task) {
        let user = await User.findOne({ where: { email: userToAssignEmail } });
        if (user) {
          // If task and user both exist
          // assign the task
          const updatedTask = await task.update({ userId: user.toJSON().id });
          if (updatedTask) {
            res.json({ message: 'Task updated successfuly', updatedTask });
          }
        } else {
          //await sendEmail(userToAssignEmail);
          res.json({
            message: `Email sent to ${userToAssignEmail} to register on TODO APP`,
          });
        }
      } else {
        throw new Error('Task not found');
      }
    } else {
      throw new Error('User ID or Task ID not found');
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise<{ 'Total Tasks': number, Tasks: Task[] }>
 */
export const searchTask = async (req: Request, res: Response) => {
  try {
    const text = req.query.text;
    console.log(text, `'%${text}%'`);
    const { count, rows } = await Task.findAndCountAll({
      where: {
        description: {
          [Op.like]: `%${text}%`,
        },
      },
    });
    res.json({ 'Total Tasks': count, Tasks: rows });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

/**
 *
 * @param req Request object
 * @param res Response object
 * @returns string
 */
export const restoreTask = async (req: Request, res: Response) => {
  try {
    const taskToRestoreId = req?.body.taskToRestoreId;
    if (taskToRestoreId) {
      Task.restore({ where: { id: taskToRestoreId } }).then(() => {
        res.json('Task restored successfully');
      });
    } else {
      throw new Error('Task ID not found');
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise <Task[]>
 */
export const importTask = async (req: Request, res: Response) => {
  const tasks = await getTasksFromFile('../input-data/tasks.json');
  res.json(tasks);
};

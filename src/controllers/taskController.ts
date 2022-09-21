import Task from '../models/Task';
import { Request, Response } from 'express';
import { TaskInfo, updateTaskInfo } from '../interfaces/taskInfo';

export const createTask = async (req: TaskInfo, res: Response) => {
  try {
    const { description, status = 0, userId } = req.body;
    let newTask = await Task.create({ userId, description, status });
    await newTask.save().then((task) => {
      console.log('Task created', task);
      return res.json({ message: 'Task Created Successfuly! ', Task: newTask });
    });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};
export const getTask = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limitVal = req.query.limit || 10;
    const offsetVal = req.query.offset || 1;
    const { count, rows } = await Task.findAndCountAll({
      where: { userId: userId },
      offset: +offsetVal,
      limit: +limitVal,
    });
    if (rows.length > 0) {
      return res.json({ 'Total Tasks': count, Tasks: rows });
    }
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};
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

import { Request } from 'express';
import { EnumType } from 'typescript';

enum TaskStatus {
  NEW,
  INPROGRESS,
  DONE,
}
export interface TaskInfo extends Request {
  userId: number;
  description: string;
  status: TaskStatus;
}

export interface updateTaskInfo extends Partial<TaskInfo> {}

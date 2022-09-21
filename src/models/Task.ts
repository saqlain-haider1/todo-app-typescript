import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/database';
import User from './User';

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    description: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize: sequelize,
    modelName: 'task',
    tableName: 'Task',
  }
);

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

export default Task;

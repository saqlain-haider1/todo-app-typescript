import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/database';
import User from './User';

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'id',
      },
    },
    userId: { type: DataTypes.STRING },
    details: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'NEW' },
  },
  {
    sequelize: sequelize,
    modelName: 'Task',
  }
);

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

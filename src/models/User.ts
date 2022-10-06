import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/database';

// User model for storing user information in the database
class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'member' },
  },
  {
    sequelize,
    paranoid: true,
    tableName: 'User',
    modelName: 'user',
  }
);
export default User;

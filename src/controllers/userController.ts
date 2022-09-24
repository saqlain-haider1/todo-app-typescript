import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { userSignupDetails } from '../interfaces/userData';
import User from '../models/User';
import { Request, Response } from 'express';

/**
 *
 * @param req userSignupDetails
 * @param res Response object
 * @returns Promise< { message: string } >
 */
export const userSignUp = async (req: userSignupDetails, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (name && password && email) {
      // If user details is present in the request body
      const user = await User.findOne({ where: { email: email } });
      // If user email is already present in the database
      if (user) {
        res.status(409).json({ message: 'Email already in use' });
      } else {
        // create new user object
        let hashValue = await bcrypt.hash(password, 10);
        let newUser = await User.create({
          name,
          email,
          password: hashValue,
          role,
        });
        newUser.save().then((user) => {
          console.log('Created User: ' + user);
          return res
            .status(200)
            .json({ message: 'User created successfully!' });
        });
      }
    } else {
      throw new Error('Invalid user data!');
    }
  } catch (err: any) {
    console.log('Error', err);
    res.json({ error: err.message });
  }
};

/**
 *
 * @param req : Partial<userSignupDetails>
 * @param res : Response object
 * @returns : Promise<{ message: string, token: JWTTOKEN  }>
 */
export const userLogin = async (
  req: Partial<userSignupDetails>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const result = bcrypt.compare(
        password,
        user.toJSON().password,
        function (err, result) {
          if (err) {
            throw err;
          }
          if (result) {
            const token = jwt.sign(
              {
                userId: user.toJSON().id,
                email: user.toJSON().email,
              },
              process.env.JWT_SECRET as Secret,
              {}
            );
            return res
              .status(200)
              .json({ message: 'Auth Succeded!', token: token });
          } else {
            return res.status(400).json({ message: 'Auth Failed!' });
          }
        }
      );
    } else {
      throw new Error('Email or Password is incorrect !');
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 *
 * @param req : Request object
 * @param res : Response object
 * @returns : Promise { count: number, Users: User[] }
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    let { count, rows } = await User.findAndCountAll();
    if (rows.length > 0) {
      res.json({ count: count, Users: rows });
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
/**
 *
 * @param req : Request object
 * @param res : Response object
 * @returns : Promise<User>
 */
export const changeRole = async (req: Request, res: Response) => {
  try {
    const userToChangeId = req?.body.userToChangeId;
    const user = await User.findByPk(userToChangeId);
    if (user) {
      const newRole = user.toJSON().role === 'admin' ? 'member' : 'admin';
      const updatedUser = await user.update({ role: newRole });
      if (updatedUser) {
        res.json(updatedUser);
      }
    } else {
      throw new Error('User not found');
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 *
 * @param req : Request object
 * @param res : Response object
 * @returns : Promise <string>
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userToDeleteId = req?.body.userToDeleteId;
    const user = await User.findByPk(userToDeleteId);
    if (user) {
      user.destroy().then(() => {
        res.json('User deleted');
      });
    } else {
      throw new Error('User not found');
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 *
 * @param req : Request object
 * @param res : Response object
 * @returns : Promise <string>
 */
export const restoreUser = async (req: Request, res: Response) => {
  try {
    const userToRestoreId = req?.body.userToRestoreId;
    if (userToRestoreId) {
      User.restore({ where: { id: userToRestoreId } }).then(() => {
        res.json('User restored successfully');
      });
    } else {
      throw new Error('User Id not found');
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

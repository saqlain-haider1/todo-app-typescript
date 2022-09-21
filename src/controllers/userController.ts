import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { userSignupDetails } from '../interfaces/userData';
import User from '../models/User';
import { Response } from 'express';

// Function to handle userSignUp
export const userSignUp = async (req: userSignupDetails, res: Response) => {
  try {
    const { name, email, password } = req.body;
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

// Function to handle user login
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

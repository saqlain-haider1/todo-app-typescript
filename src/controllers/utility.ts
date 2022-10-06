import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import console from 'console';
import dotenv from 'dotenv';
dotenv.config();
import { resolve } from 'path';

const setApiKey = (receiverEmail: string) =>
  sgMail.setApiKey(process.env.EMAIL_API_KEY!);

// Utility function to send email to the unregistered email
export const sendEmail = async (receiverEmail: string) => {
  try {
    setApiKey(process.env.EMAIL_API_KEY!);
    const msg = {
      to: receiverEmail,
      from: process.env.SECRET_EMAIL!, // Use the email address or domain you verified above
      subject: 'Reistration on TODO Application',
      html: '<strong>DO REGISTER ON OUR PLATFORM TO SEE WHICH TASKS ARE ASSIGNED TO YOU!</strong>',
    };
    await sgMail.send(msg);
  } catch (err: any) {
    console.log('Error in sendEmail: ', err.message);
  }
};

// Utility function to fetch tasks from input file
export const getTasksFromFile = async (filePath: string) => {
  const data = require(filePath);
  return data;
};

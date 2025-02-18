import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';

import { emailHtml, emailOtpHtml, emailTicketHtml } from "./email-html";
import { TicketStatus, TicketType } from "../../common/shared";
@Injectable()
export class EmailService {
  constructor(private jwtService: JwtService) { }
  //verify email
  async sendEmails(email: string, name: string, req: Request) {
    //create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    //generate token
    const token = this.jwtService.sign(
      { email },
      { secret: process.env.VERIFY_TOKEN_EMAIL, expiresIn: '5m' },
    );

    const info = await transporter.sendMail({
      from: `"Ali Kato 🐝" <${process.env.EMAIL_SENDER}>`, // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      html: emailHtml(name, token, req), // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  //otp
  async sendEmailsOtp(
    otp: string,
    name: string,
    email: string,
  ) {
    //create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    

    const info = await transporter.sendMail({
      from: `"3mk Ali Kato 👻" <${process.env.EMAIL_SENDER}>`, // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      html: emailOtpHtml(name,otp), // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  async sendEmailsTicket(
    email:string,name:string,title:string,description:string,ticketStatus:string|TicketStatus,ticketNum:string,ticketType?:TicketType|string
  ) {
    //create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    

    const info = await transporter.sendMail({
      from: `"3mk Ali Kato 👻" <${process.env.EMAIL_SENDER}>`, // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      html: emailTicketHtml(name,title,description,ticketStatus,ticketNum,ticketType), // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
}
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyMailerService {
  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('MAIL_API_KEY'));
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const mail = {
      to: email,
      subject: 'Hello from sendgrid',
      from: 'sarut1994@gmail.com', // Fill it with your validated email on SendGrid account
      text: 'Hello',
      html: '<h1>Hello</h1>',
      templateId: 'd-975d08ff887844eeb7ecc055728888ae',
      dynamicTemplateData: {
        first_name: username,
      },
    };

    await this.send(mail);
  }

  async send(mail: SendGrid.MailDataRequired) {
    try {
      await SendGrid.send(mail);
    } catch (error) {
      console.error('Error sending email', error.response.body.errors);
    }
  }
}

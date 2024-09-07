import { Injectable } from '@nestjs/common';
import { MailDataRequired, default as SendGrid } from '@sendgrid/mail';

@Injectable()
export class MyMailerService {
  constructor() {
    SendGrid.setApiKey(process.env.MAIL_API_KEY);
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    const mail: SendGrid.MailDataRequired = {
      to: email,
      subject: 'Hello from SendGrid',
      from: 'sarut1994@gmail.com', // Fill it with your validated email on SendGrid account
      text: 'Hello, this is a test email from SendGrid.',
      html: '<p>Hello, this is a test email from SendGrid.</p>',
    };

    await this.send(mail);
  }

  async send(mail: MailDataRequired) {
    try {
      await SendGrid.send(mail);
    } catch (error) {
      console.error('Error sending email', error.response ? error.response.body : error);
    }
  }
}

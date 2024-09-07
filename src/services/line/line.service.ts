import { Injectable } from '@nestjs/common';

@Injectable()
export class LineNotificationService {
  private url = 'https://notify-api.line.me/api/notify';
  private readonly accessToken = '3TzkdLuN8AWaNgRaFB02fgMgT3akDW6bz9umey9K6vp'; // Replace with your actual access token
  private readonly header = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${this.accessToken}`,
  };

  async sendOrderNotification(message: string) {
    const payload = {
      message: message,
    };

    try {
      return await fetch(this.url, {
        method: 'POST',
        headers: this.header,
        body: new URLSearchParams(payload).toString(),
      });
    } catch (error) {
      console.error(`Failed to send notification: ${error}`);
    }
  }
}

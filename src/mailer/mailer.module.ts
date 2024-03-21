import { Module } from '@nestjs/common';
import { MyMailerService } from './mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import configuration from '../config/configuration';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            host: configuration().mailer.transport.host,
            port: configuration().mailer.transport.port,
            secure: false,
            auth: {
              user: configuration().mailer.transport.auth.user,
              pass: configuration().mailer.transport.auth.pass,
            },
          },
          defaults: {
            from: '"No Reply" <sarut1994@gmail.com>',
          },
        };
      },
    }),
  ],
  providers: [MyMailerService],
  exports: [MyMailerService],
})
export class MyMailerModule {}

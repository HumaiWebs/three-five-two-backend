import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { MailService } from './shared/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ActivityModule } from './modules/activity/activity.module';
import { SocketModule } from './modules/socket/socket.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    AuthModule,
    DatabaseModule,
    WorkspaceModule,
    ActivityModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as pug from 'pug';

@Injectable()
export class MailService {
  private templateDir = path.join(process.cwd(), 'templates/mail');
  constructor(private readonly mailer: MailerService) {}

  async sendInvitationEmail(
    to: string,
    workspaceName: string,
    inviterName: string,
    invitationId: string,
  ) {
    try {
      const acceptUrl = `${process.env.CLIENT_URL}/invitations/accept?email=${encodeURIComponent(to)}&invitationId=${encodeURIComponent(invitationId)}`;

      const invitationTemplate = pug.renderFile(
        `${this.templateDir}/invite-to-workspace.pug`,
        { workspaceName, inviterName, acceptUrl },
      );

      await this.mailer.sendMail({
        from: 'quackaduck076@gmail.com',
        to,
        subject: `Invitation to join workspace: ${workspaceName}`,
        html: invitationTemplate,
        context: {
          workspaceName,
          inviterName,
        },
      });
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to send email' };
    }
  }
}

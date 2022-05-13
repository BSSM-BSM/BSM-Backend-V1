import { InternalServerException } from '@src/util/exceptions';
import nodemailer from 'nodemailer';

const send = (
    to: string,
    subject: string,
    html: string
) => {
    const transport = nodemailer.createTransport({
        host: 'bssm.kro.kr',
        secure: true,
    })
    const mailOptions = {
        from: "BSM@bssm.kro.kr",
        to,
        subject,
        html
    }
    return new Promise(resolve => {
        transport.sendMail(mailOptions, (error, response) => {
            if (error) {
                throw new InternalServerException('Failed to send mail');
            }
            transport.close();
            resolve(response);
        })
    })
}
export {
    send
}
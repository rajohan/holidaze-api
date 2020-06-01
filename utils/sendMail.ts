import sgMail from "@sendgrid/mail";

import { Mail } from "../types";
import { config } from "../config";

const sendMail = async ({ to, subject, text, html }: Mail): Promise<void> => {
    sgMail.setApiKey(config.sendGridApiKey as string);

    const msg = {
        to,
        from: "holidaze@rajohan.no",
        subject,
        text,
        html
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.log("Failed to send mail", error);
    }
};

export { sendMail };

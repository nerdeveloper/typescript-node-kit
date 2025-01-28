import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

// Step 1: Configure Nodemailer with SendGrid
const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY || '', // Ensure your API key is stored securely
    })
);

// Step 2: Send an Email
export const send = async (req: any, res: any) => {
    try {
        const mailOptions = {
            to: req.body.email, // Enter the email address that will receive emails. Defaults: Sends email to the `from` object.
            from: `${req.body.name} ${req.body.surname} <${req.body.email}>`,
            subject: `Choice of Framework is: ${req.body.need}`,
            text: req.body.message,
        };
        transport.sendMail(mailOptions, (error) => {
            if (error) {
                req.flash("error", "Error! We did Something wrong");
                res.redirect("/contact");
            } else {
                req.flash("success", "Email has been sent successfully!");
                res.redirect("/contact");
            }
        });
    } catch (error) {
      console.error('Error sending email:', error);
    }
}

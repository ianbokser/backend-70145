import nodemailer from "nodemailer"

const transporter=nodemailer.createTransport(
    {
        service: "gmail", 
        port: 587, 
        auth: {
            user: "diegopolverelli@gmail.com",
            pass: "rxyn hwvr ieub scis"
        }
    }
)

export const enviar=(subject, to, message, attachments)=>{
    return transporter.sendMail({
        subject,
        from: `Diego diegopolverelli@gmail.com`,
        to,
        html: message,
        attachments
    })
}
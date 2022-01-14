const nodemailer = require("nodemailer")

const send = (to, subject, html) => {
    const transport = nodemailer.createTransport({
        host:"bssm.kro.kr",
        secure:true,
    })
    const mailOptions = {
        from:"BSM@bssm.kro.kr",
        to:to,
        subject:subject,
        html:html
    }
    return new Promise(resolve => {
        transport.sendMail(mailOptions, (error, response) =>{
            if(error){
                result={
                    status:3,
                    subStatus:9
                }
            }else{
                result={
                    status:1,
                    subStatus:0
                }
            }
            transport.close()
            resolve(result)
        })
    })
}
module.exports = {
    send:send
}
const nodemailer=require('nodemailer')
const pug=require('pug')
const juice = require('juice')
const htmlToText=require('html-to-text')
const util=require('util')
const emailConfig= require('../config/email')

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
  });

  //generar HTML
  const generarHTML=(archivo,opciones={})=>{
      const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`,opciones)
      return juice(html)
  }
  exports.enviar=async(opciones)=>{
    //let info = await transport.sendMail({})
    const html=generarHTML(opciones.archivo,opciones)
    const text=htmlToText.fromString(html)
    let mailOptions = {    
    from: '"Uptask" <noreply@uptask.com>', // sender address
    to: opciones.usuario.email, // list of receivers
    subject: opciones.subject, // Subject line
    text, // plain text body
    html, // html body
    };
    const enviarMail= util.promisify(transport.sendMail,transport)
    return enviarMail.call(transport,mailOptions)
  }
   
const passport = require('../config/passport')
const Usuarios= require('../models/Usuarios')
const crypto=require('crypto')
const Sequelize  = require('sequelize')
const Op= Sequelize.Op
const bcrypt=require('bcrypt-nodejs')
const enviarEmail=require('../handlers/email')

exports.auntenticarUsuario= passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios',
    
})

//Funcion para revisar si el usuario esta autenticado
exports.usuarioAuntenticado= (req,res,next) =>{
    // si el usuario esta aunteticado adelante
    if (req.isAuthenticated()){
        return next();
    }
    // sino esta auntenticado redirigir a la pagina principal
    return res.redirect('/iniciar-sesion')
}
exports.cerrarSesion=(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion')
    })
}

//genera un token si el usuario es valido
exports.enviarToken=async(req,res,next)=>{
    const {email}= req.body
    //verificar si el usuario existe
    const usuario= await Usuarios.findOne({where:{email}})
    //sino existe un usuario
    
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer',{
            nombrePagina: 'Reestablecer tu Contraseña',
            mensajes: req.flash()
        })
        return next()
    }

    //usuario existe

    usuario.token= crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000
    // console.log(token)
    // console.log(expiracion)
    //guardarlos en la base de datos

    await usuario.save();

    //url de Reset

    const resetUrl=`http://${req.headers.host}/reestablecer/${usuario.token}`

    //console.log(resetUrl)
    //Envia el correo con el token 

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    })

    //terminacion
    req.flash('correcto','se envio un mensaje a tu correo')
    res.redirect('iniciar-sesion')

}

exports.validarToken= async (req,res)=>{
    //res.json(req.params.token)
    const usuario =await Usuarios.findOne({
        where:{
            token: req.params.token
        }})

    //sino encuentra el usuario     
    //console.log(usuario)
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/reestablecer')
    }
    //console.log(usuario)

    //formulario para generar el password
    res.render('resetPassword',{
        nombrePagina:'Reestablecer contraseña'
    })
}

exports.actualizarPassword= async (req,res)=>{
    const usuario= await Usuarios.findOne({where:{
        token: req.params.token,
        expiracion: {
            [Op.gte]: Date.now()     
        }
    }})

    // verificamos si el usuario existe
    //console.log(usuario)
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/reestablecer')
        console.log('si entro supongo')
    }

    //hashear el codigo de nuevo
    
    usuario.password=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
    usuario.token=null
    usuario.expiracion=null

    //guardamos el nuevo password

    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')
  
}
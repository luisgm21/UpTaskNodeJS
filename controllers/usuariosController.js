const Usuarios = require('../models/Usuarios')
const enviarEmail=require('../handlers/email')
exports.formCrearCuenta=(req,res)=>{
    res.render('crearCuenta',{
        nombrePagina: 'Crear Cuenta UpTask'
    })
}

exports.formIniciarSesion=(req,res)=>{
    const {error} =res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar Sesion en UpTask',
        error
    })
}

exports.crearCuenta=async (req,res)=>{
    //res.send('Hola')
    //console.log(req.body)
    const {email, password}= req.body;

    try{
        await Usuarios.create({
            email,
            password
        })

        // crear una URL de confirmar
         const confirmarUrl=`http://${req.headers.host}/confirmar/${email}`
        //crear el objeto usuario

         const usuario= {
            email
        }
        //console.log(usuario);
        //enviar email
        await enviarEmail.enviar({
             usuario,
             subject: 'Confirma tu cuenta UpTask',
             confirmarUrl,
             archivo: 'confirmar-cuenta'
         })
        //redirigir al usuario

        req.flash('correcto','Enviamos un correo, confirma tu cuenta')
        res.redirect('/iniciar-sesion')
    }catch(error){
        console.log(error)
        req.flash('error', error.errors.map(error =>error.message))
        res.render('crearCuenta',{

            mensajes: req.flash() ,
            nombrePagina: 'Crear Cuenta UpTask',
            email,
            password
        })

    }
}
 //Resetear contraseña :)
 exports.formRestablecerPassword = (req,res)=>{
      res.render('reestablecer',{
         nombrePagina: 'Reestablecer tu contraseña'
      })
 
 }
 // cambia el estado de una cuenta
 exports.confirmarCuenta=async(req,res)=>{
    //res.json(req.params.correo);
    const usuario= await Usuarios.findOne({where:{email: req.params.correo}})
    //Si no existe el usuario
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/crear-cuenta')
    }
    usuario.activo=1;
    await usuario.save()
    req.flash('correcto','Cuenta activada correctamente')
    res.redirect('/iniciar-sesion')
 }
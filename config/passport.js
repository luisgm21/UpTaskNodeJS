const passport = require('passport');
const LocalStrategy=require('passport-local').Strategy;

//Referencia al Modelo vamos a aunteticar

const Usuarios = require('../models/Usuarios')

// local strategy - Login con credenciales propios (usuario y password)

passport.use(
    new LocalStrategy(
        //por default passport espara un espacio y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done)=>{

            try {
                const usuario= await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1

                    }
                })
                //el usuario existe y password incorrecta
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                //Usuario correcto y password correcto
                return done(null,usuario)
            } catch (error) {
                //Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

//Serializar el usuario

passport.serializeUser((usuario,callback)=>{
    callback(null, usuario);
})

//Deserializar el usuario

passport.deserializeUser((usuario,callback)=>{
    callback(null, usuario);
})

//exportar

module.exports = passport
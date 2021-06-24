const { response } = require('express');
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator')
const flash= require('connect-flash')
const session = require('express-session')
const cookieParser=require('cookie-parser')
const passport=require('./config/passport')
// helpers
const helpers=require('./helpers')
//establecer la coneccion con la base de datos
const db= require('./config/db');
//importar el modelo
require('./models/Proyectos');
require('./models/Tareas')

db.sync()
    .then(()=>console.log('Conectado al servidor'))
    .catch(error => console.log(error) );


// crear app en express

const app = express();


// donde cargar los archivos estaticos

app.use(express.static('public'))
// habilitar pug

app.set('view engine','pug')

//habilitar bodyparser para leer los formularios
app.use(bodyParser.urlencoded({extended: true}))

//validar

app.use(expressValidator());


//flash messages

app.use(flash())

app.use(cookieParser())



app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
    
}))

app.use(passport.initialize())

app.use(passport.session())


// creamos una carpeta views
app.set('views', path.join(__dirname,'./views'));
//habilitamos la funcion vardump
app.use((req,res,next)=>{
    res.locals.vardump =helpers.vardump;
    res.locals.mensajes=req.flash()
    res.locals.usuario= {...req.user} || null
    //console.log(res.locals.usuario) 
    next();
})


app.use('/',routes())
 // configuro el servidor en el puerto 3000 
 app.listen(3000);


 //require('./handlers/email')

const Sequelize=require('sequelize')
const db=require('../config/db');
const Proyectos =require('../models/Proyectos')
const bcrypt= require('bcrypt-nodejs');
const { validate } = require('webpack');

const Usuarios = db.define('usuarios',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        unique :{
            args: true,
            msg: 'Usuario ya registrado' 
        } ,
        validate: {
            isEmail:{
                msg:'agrega un correo valido'
            },
            notEmpty:{
                msg:'El campo email no puede ir vacio'
            }
        }
 
        
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{ 
                msg:'El campo password no puede ir vacio'
            }

        }
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE 
    
},{
    hooks:{
        beforeCreate(usuario){
            // console.log('Creando nuevo usuario')
            // console.log(usuario)
            usuario.password=bcrypt.hashSync(usuario.password,bcrypt.genSaltSync(10))

        }
    }
},)

Usuarios.prototype.verificarPassword=function(password){
    return bcrypt.compareSync(password,this.password)
}

Usuarios.hasMany(Proyectos); 

module.exports=Usuarios;

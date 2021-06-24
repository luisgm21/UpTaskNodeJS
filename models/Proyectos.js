const Sequelize=require('sequelize')
const db = require('../config/db')
const slug=require('slug')
const shorid=require('shortid')

const Proyectos = db.define('proyectos',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING

    },
    url: Sequelize.STRING

},{
    hooks:
    {
        beforeCreate(proyecto){
            const url= slug(proyecto.nombre).toLowerCase();
            
            
            
            proyecto.url=`${url}-${shorid.generate()}`;
        }
    }
})

module.exports=Proyectos;
    

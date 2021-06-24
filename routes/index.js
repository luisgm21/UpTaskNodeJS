const express = require('express');
const router = express.Router();
const {body} = require('express-validator/check')
 
//importar controlador
const proyectosController=require('../controllers/proyectosController');
const tareasController= require('../controllers/tareasController');
const usuariosController= require('../controllers/usuariosController');
const authController=require('../controllers/authController')

module.exports = function(){
// ruta para el home
router.get('/',
  authController.usuarioAuntenticado,
  proyectosController.proyectoHome
)
router.get('/nuevo-proyecto',
  authController.usuarioAuntenticado,
  proyectosController.formularioProyecto
)
router.post('/nuevo-proyecto',body('nombre').not().isEmpty().trim().escape(),
  authController.usuarioAuntenticado,
  proyectosController.nuevoProyecto
);
//listar proyecto
router.get('/proyectos/:url',
  authController.usuarioAuntenticado,
  proyectosController.proyectoPorUrl
)
// Actualizar proyecto 
router.get('/proyecto/editar/:id',
  authController.usuarioAuntenticado,
  proyectosController.formularioEditar
)
router.post('/nuevo-proyecto/:id',body('nombre').not().isEmpty().trim().escape(),
  authController.usuarioAuntenticado,
  proyectosController.actualizarProyecto
);
//eliminar proyecto
router.delete('/proyectos/:url',
  authController.usuarioAuntenticado,
  proyectosController.eliminarProyecto
);
// Tareas
//Agregar Tarea
router.post('/proyectos/:url',
  authController.usuarioAuntenticado,
  tareasController.agregarTarea
)
//Actualizar Tarea
router.patch('/tareas/:id',
  authController.usuarioAuntenticado,
  tareasController.cambiarEstadoTarea
)
//Eliminar Tarea 
router.delete('/tareas/:id',
  authController.usuarioAuntenticado,
  tareasController.eliminarTarea
)
//crear nueva cuenta
router.get('/crear-cuenta',usuariosController.formCrearCuenta)
router.post('/crear-cuenta',usuariosController.crearCuenta)
router.get('/confirmar/:correo',usuariosController.confirmarCuenta)
//iniciar sesion
router.get('/iniciar-sesion',usuariosController.formIniciarSesion)
router.post('/iniciar-sesion',authController.auntenticarUsuario)
//cerrar sesion
router.get('/cerrar-sesion',authController.cerrarSesion)
//reestablecer contraseña
router.get('/reestablecer',usuariosController.formRestablecerPassword)
router.post('/reestablecer',authController.enviarToken)
router.get('/reestablecer/:token',authController.validarToken)
router.post('/reestablecer/:token',authController.actualizarPassword)
return router;
}
 

 

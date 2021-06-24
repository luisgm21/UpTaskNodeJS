const Proyectos=require('../models/Proyectos')
const Tareas=require('../models/Tareas')

exports.agregarTarea=async (req,res,next)=>{
    const proyecto = await Proyectos.findOne({where:{url: req.params.url}});
    //  comprobar datos en la consola
    //console.log(proyecto);
    //console.log(req.body);
    //leer el valor del input 
    const{tarea}=req.body
    // estado 0 tarea incompleta y id del proyecto
    const estado=0;
    const proyectoId=proyecto.id;
    // insertar en la base de datos
    const resultado= await Tareas.create({tarea,estado,proyectoId});
    if(!resultado){
        return next();
    }
    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}
exports.cambiarEstadoTarea= async(req,res,next)=>{
    const {id}=req.params;
    // console.log(id)
    const tarea= await Tareas.findOne({where:{id}})
    //console.log(tarea)
    //cambiar de estado 
    let estado = 0;

    if(tarea.estado===estado){
        estado=1;
    }
    tarea.estado=estado;

    const resultado= await tarea.save();

    if(!resultado) return next();

    res.status(200).send("Actualizado")
}

exports.eliminarTarea=async(req,res,next)=>{
    const {id}= req.params;

     //Eliminamos la tarea

    const resultado = await Tareas.destroy({where:{id}});

    if(!resultado) return next();

    res.status(200).send('Eliminando')
}
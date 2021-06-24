import axios from "axios";
import Swal from "sweetalert2";
import  { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click',e=>{
        if(e.target.classList.contains('fa-check-circle')){
            //console.log('Actualizando ...');
            const icono =e.target;
            const idTarea=icono.parentElement.parentElement.dataset.tarea;
            //console.log(idTarea)

            //request hacia /tareas/:id

            const url =`${location.origin}/tareas/${idTarea}`;

            //console.log(url)
          
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    if(respuesta.status===200){
                        icono.classList.toggle('completo');
                        
                        actualizarAvance();
                    }
                })
        }
        if(e.target.classList.contains('fa-trash')){
            //console.log('Eliminando...')
            const tareaHTML=e.target.parentElement.parentElement,
                  idTarea=tareaHTML.dataset.tarea
            // console.log(tareaHTML)
            // console.log(idTarea)
            Swal.fire({
                title: 'Deseas Borrar Esta Tarea?',
                text: "Una tarea eliminada no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminalo!',
              cancelButtonText: 'No, Cancelar'
        }).then((result) => {
              if (result.isConfirmed) {
                const url =`${location.origin}/tareas/${idTarea}`;
                // enviar peticion a axios
                //console.log('Eliminando ...')
                axios.delete(url,{params: {idTarea}})
                    .then(function(respuesta){
                        //console.log(respuesta)
                        if(respuesta.status===200){
                            // Eliminamos el nodo
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            //Opcional una alerta
                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'success'
                            )
                            actualizarAvance();
                        }
                    } )
              }
            })
        }
    })

}

export default tareas;
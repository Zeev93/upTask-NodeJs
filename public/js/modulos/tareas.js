import axios from "axios"
import Swal from 'sweetalert2'
import {actualizarAvance} from '../funciones/avances'

const tareas = document.querySelector('.listado-pendientes')

if(tareas){
    
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-circle-check')){
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea

            // Request a tareas
            const url = `${location.origin}/tareas/${idTarea}`

            axios.put(url, { idTarea })
            .then( response => {
                if(response.status === 200){
                    icono.classList.toggle('completo')
                    actualizarAvance()
                }
            })
            .catch( error => {

            })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement
            const idTarea = tareaHTML.dataset.tarea

            
            Swal.fire({
                title: 'Deseas borrar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {

                    const url = `${location.origin}/tareas/${idTarea}`
                    axios.delete(url, { params: { id: idTarea}})
                    .then( response => {
                        if(response.status === 200){
                            // Eliminar Nodo
                            tareaHTML.parentElement.removeChild(tareaHTML)

                            // Opcional alerta
                            Swal.fire(
                                'Tarea Eliminada',
                                response.data,
                                'success'
                            )
                            actualizarAvance()
                        }
                    })
                }
            })
        }
    })
}

export default tareas
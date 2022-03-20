const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.nuevaTarea = async (req, res, next) => {
    // Obtenemos proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url}})
    // Leer el valor del input
    const {tarea} = req.body

    // estado 0 = incompleto e ID de proeycto
    const estado = 0
    const proyectoId = proyecto.id
    

    // Insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId})


    if(!resultado){
        return next();
    }
    // Redireccionar
    res.redirect(`/proyectos/${req.params.url}`)
}

exports.cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params
    const tarea = await Tareas.findOne( { where: {id}} )


    tarea.estado = !tarea.estado

    const resultado = await tarea.save()

    if(!resultado) return next()

    res.status(200).send('Actualizado')
}

exports.eliminarTarea = async (req, res, next) => {
    const {id} = req.query

    const resultado = await Tareas.destroy( { where: { id }} )
    
    if(!resultado) return next()

    res.status(200).send('Tarea Eliminada')
}
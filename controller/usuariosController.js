const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')


exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en UpTask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    // Leer los datos
    const { email, password } = req.body

    try {
        //Crear al usuario
        await Usuarios.create({
            email,
            password
        })

        /// Crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`

        /// Crear el objeto de usuario
        const usuario = {
            email
        }
        /// Enviar Email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })

        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
        // Redirigir al usuario
        res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error.errors.map( error => error.message))
        res.render('crearCuenta', {
            nombrePagina: 'Crear Cuenta en Uptask',
            mensajes: req.flash(),
            email
        })
    }

}


exports.confirmarCuenta = async (req, res, next) => {

    const {email} = req.params
    const usuario = await Usuarios.findOne( { where: { email } } )
    
    
    if(!usuario){
        req.flash('error', 'No valido')
        res.redirect('/crear-cuenta')
    }

    
    usuario.activo = 1 
    await usuario.save()

    req.flash('correcto', 'Cuenta activada correctamente')
    res.redirect('/iniciar-sesion')
}

exports.formReestablecerPassword = async (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    })
}
const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const crypto = require('crypto')
const Sequelize  = require('sequelize')
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs')

const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado, adelante
        if(req.isAuthenticated()){
            return next();
        }

    // sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion')
}

exports.cerrarSession = (req, res, next) => {
    req.session.destroy( () => {
        res.redirect('/iniciar-sesion') // Al cerrar sesion nos lleva al login
    })
}

// Genera token si el usuario es valido

exports.enviarToken = async (req, res, next) => {
    const {email} = req.body
    const usuario = await Usuarios.findOne({ where: { email }})

    if(!usuario){
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer')
    }

    // usuario existe

    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiration = Date.now() + 3600000

    // Guardarlos en la BD
    await usuario.save()

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    })

    // terminar la ejecucion

    req.flash('correcto', 'Se envio un mensaje a tu correo')
    res.redirect('/iniciar-sesion')

}

exports.formValidarToken = async ( req, res, next ) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token}})

    // sino encuentra el usuari

    if(!usuario){
        req.flash('error', 'No Valido')
        res.redirect('/reestablecer')
    }

    // Formulario para generar password

    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

exports.actualizarPassword = async (req, res, next) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token, expiration: { [Op.gte] : Date.now () } } } )
    
    
    if(!usuario) {
        req.flash('error', 'No Valido')
        res.redirect('/reestablecer')
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiration = null
    await usuario.save()

    req.flash('correcto', 'Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')


}
const Sequelize = require('sequelize')
const db = require('../config/db')
const Proyectos = require('../models/Proyectos')
const bcrypt = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            isEmail:{
                msg: 'Agregar un correo valido'
            },
            notEmpty: {
                msg: 'El E-mail no puede ir vacio'
            },
            
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            },
            min: {
                args: 8,
                msg: 'El password debe contener al menos 8 caracteres'
            }
        }
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE,
    activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    }
}, {
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
})

// Metodos Personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos)

module.exports = Usuarios
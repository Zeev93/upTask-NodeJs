const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
require("dotenv").config({ path: "variables.env" });


// Helpers con algunas funciones

const helpers = require('./helpers')


// Crear conexion a bd
const db = require('./config/db')

// Importar modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
    .then( () => console.log('Conectado al servidor'))
    .catch( error => console.log(error))

// Crear app de express
const app = express();

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}))

// Agregamos express validator a toda la aplicacion
app.use(expressValidator())

// Donde cargar los archivos estaticos
app.use(express.static('public'))

// Habilitar template engine
app.set('view engine', 'pug')

// Agregar carpeta de vistas
app.set('views', path.join(__dirname, './views'))

// Agregar flash message
app.use(flash())

//
app.use(cookieParser())

// Sesiones nos permiten navegar entre distintas paginas sin re auth
app.use(session({ secret: 'supersecreto', resave: false, saveUninitialized: false }))

// 
app.use(passport.initialize())
app.use(passport.session())


// Pasar var dump a la aplicacion
app.use((req, res, next) => { 
    res.locals.vardump = helpers.vardump
    res.locals.mensajes = req.flash()
    res.locals.usuario = { ...req.user } || null
    next()
})

// Routes
app.use('/', routes())

//Servidor y puerto

const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || 3000

app.listen(port, host, () => {
    console.log("El servidor esta funcionando");
})






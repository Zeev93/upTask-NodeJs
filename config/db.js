const { Sequelize } = require("sequelize");
// Extraer valores de variables

require("dotenv").config({ path: "variables.env" });

// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize(
	process.env.DB_NOMBRE,
	process.env.BD_USER,
	process.env.BD_PASS,
	{
		host: process.env.BD_HOST,
		dialect: "mysql",
		port: process.env.BD_POST,
		define: {
			timestamps: false,
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

module.exports = db;

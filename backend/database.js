/**
 * Modulo de conexion a la base de datos MongoDB
 * 
 * Este archivo maneja la conexion de la base de datos a mongodb usando Mongoose
 * establece la conexion con la base de datos
 * configura las opciones de conexion
 * maneja los erroes de conexion
 * Exporta la funcion connectDB para usarla en server.js
 */

const Mongoose = require('mongoose');

const {DB_URI} = process.env;

const conectDB = async ()=>{
    try{
        await monggoose.connect(DB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('ok  ongoDB conectado')
    }
    catch (err){
        console.error('X error de conexion MongoDb ',
            err.message);
            process.exit(1)

    }
};

module.exports =conectDB;
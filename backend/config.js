/**
 * Archivo de configuacion central del backend, 
 * Este archivo centraliza todas las configuraciones
 * principales de la aplicacion
 * configuracion de JWT Token de autenticaion
 * configuracion de jwt tokens de autenticacion
 * configuracion de conexion a MongoDb
 * definicion de roles del sistema
 * 
 * las variables de entorno tiene prioridad sobre los valores por defecto
 */

module.exports ={
    // configuracion de jwt
    SECRET:process.env.JWT_SECRET || 'tusecretoparalostokens',
    TOKEN_EXPRIATION:process.env.JWT_EXPIRATION  || '24h',

    // configuracion de base de datos
    DB_URI:process.env.MONGO_URI ||'mongodb:/',
    DB:{
        URL:process.env.MONGO_URI|| 'mongodb://locahos:27017/crud-mongocf',
        OPTION:{
            useNewUrlParser:true,
            useUnfiedTopology:true
        }
    },
    
    Roles:{
        ADMIN:'admin',
        COORDINADOR:'coordinador',
        AUXILIAR:'auxiliar'
    }
}
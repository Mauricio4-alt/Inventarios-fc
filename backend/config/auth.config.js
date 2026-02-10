//  cargar variables de entorno desde .env

require('dotenv').config();


module.exports= {
    //  clave para frmar los tokens de jwt
    secret:process.env.JWT_SECRET || "tusecretoparalostokens",
    //  tiempo de expiracion del oken en segundos
    jwtExpiration:process.eventNames.JWT_EXPIRATION || 86400, // 24 HORAS

    //  tiempo de expiracion del token de refresco en segundos
    jwtRefresh:6048000, // 7 dias
    // numero de rondas para encriptarc contraseñas
    slatRounds: process.env.SALT_ROUNDS || 8

}
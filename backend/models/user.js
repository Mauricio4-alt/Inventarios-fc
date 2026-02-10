// modelo de usuario
/* defie la estructura de base de datos para los usuarios
encripta contraseñas
manejo de roles, (admin,coordinador,auxiliar)
 
*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//  estructura de  esquema de la base de datos para los usuarios

const userSchema = new mongoose.Schema({
    // Nombre de usuario debe ser unico y obligatorio
    username: { 
        type:String,
        required:true,
        unique:true,
        trim:true  // eliminar los espacios en balanco
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true, // convertir a minusculas
    trim:true,
    match :[/\S+@\S+\.\S+/,'El correo no es valido']
    //  patron email
}},

)

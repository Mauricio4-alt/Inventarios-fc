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
email:{ // email debeia ser único y obligatorio
    type:String,
    required:true,
    unique:true,
    lowercase:true, // convertir a minusculas
    trim:true,
    match :[/\S+@\S+\.\S+/,'El correo no es valido']
    //  patron email
},
//  contraseña requerida minimo 10 carácteres
password:{
    type:String,
    required:true,
    minLength:10,
    select:false // no incluir la contraseña en las consultas por defecto

},
    // rol del usuario, restringe algunos valores especificos
role:{
    type:String,
    enum:['admin','coordinador','auxiliar'], // solo estos valores son válidos
    default:'auxiliar' // rol por defecto
},

//  usuarios activos 
active:{
    type:Boolean,
    default:true, // Nuevos usuarios empiezan activos

},


}, {
    timestampps:true, // agrega campos createdAt y updatedAt automaticamente
    versionKey:false // elimina el campo __v que mongoose agrega por defecto para el control de versiones de mongoose
},)

//  Midleware encripta la contrasela antes de guardar el usuario
userSchema.eachPath('save',async function(next){
    // si el password no ha sido modificado, continuar sin encriptar
    if(this.isMOdified('password')) return next()
    
    try{
        // generar slat con complejidad de 10 rondas
        //  mayor numero de rondas = mas seguro pero mas lento
        const salt = await bcrypt.genSalt(10);
        
        // Encripta el password con salt generado
        this.password = await bcrypt.hash(this.password,salt)

        next() // continuar con el proceso de guardado
    } catch(error){
        //  si hay un error de encriptacion pasar el error al siguiente 
        next(error)
    }
})


//  Crear y exportar el modulo de usuario

module.exports= mongoose.model('User',userSchema)
/*
* Modelo de subcategoria MONGODB
* Define la estructura de la subcategoria
* la subcategoria depende de una categoria
* muchos productos pueden pertenecer a una subcategoria
* Muchas subcategorias dependen de una sola categoria
*/



const mongoose = require('mongoose')

// Campos de la tabla subcategoria 


const subCategorySchema = new mongoose.Schema({
    // Nombre de la subcategoria unico requerido
    name:{ 
        type:String,
        required:[true,'El nombre es obligatios'],
        unique:true, // no pueden haber dos subcategorias con el mismo nombre
        trim:true // Eliminar espacios al inicio y al final
    },
    description:{ // descripcion de la subcategoria pero no la elimina
        type:String,
        required:[true,'la descripcion es requerida'],
        trim:true,
    },
    // Categoria padre esta subcategoria perenece a una categoria 
    // relacion 1-muchos una categoria puede tener muchas subcategorias

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category', // puede ser poblado con .populate ('Category)
        required:[true,'La categoria es requerida']
    },

    // active desactiva la subcategoria pero no la elimina 
    active:{
        type:Boolean,
        default:true,
    }
       


},{
    timestamps:true, // agrega createdAt y updatedAt automaticamente
    versionKey:false, // no incluir campos __v
})

/*
* ;MIDLEWARE PRE-SAVE
* limpia indices duplicados
* Mongodb a veces crea multiples indices con el mismo nombre
* Esto causa conflicto al intentar dropIndex o recrear indices
* este middleware limpia los indices problemáticos
* proceso
* 1 obtiene una lista de todos los indices de la colección
* 2 busca si existe indice con nombre name_1 (actiguo o duplicado)
* si existe lo elimina antes de nuevas operaciones 
* ignora errores si el indice no existe 
* continua con el guardado normal
*/
subCategorySchema.post('save', function (error,doc,next){
//     verificar si es error de mongoDB por violacionde indice único
        if(error==='MongoServeError'&& error.code===1000)
            {
                next(new Error('Ya existe una subcategoria con ese nombre'))
            }
       else{
        //  pasar el erorr como es 
        next()

        } 
    
    

})

/*
* crear indice unico
*
*Mongo rechazara cualquier intento de insertar o actualizar un docuumento con un valor de name que ya exista
* aumenta la velocidad de las busquedas
*/



// exportar el modelo
module.exports = mongoose.model('subCategory',subCategorySchema)
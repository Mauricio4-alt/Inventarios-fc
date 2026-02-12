/*
* Modelo de producto MONGODB
* Define la estructura de la subcategoria
* el producto depende de una categoria
* muchos productos pueden pertenecer a una subcategoria
* tiene relacion un user para ver quien creo el producto
* Soporte de imagenes(array de url)
* validacion de valores numericos (no negaticos)
*/




const mongoose = require('mongoose')

// Campos de la tabla subcategoria 


const productSchema = new mongoose.Schema({
    // Nombre del producto  unico requerido
    name:{ 
        type:String,
        required:[true,'El nombre es obligatios'],
        unique:true, // no pueden haber dos productos con el mismo nombre
        trim:true // Eliminar espacios al inicio y al final
    },
    //  cantidad del stock
    //  el estock no puede ser negativo
    stock:{
        type:Number,
        required:[true,'el stock es obligatorio'],
        min:[0,'el stock no puede ser negativo']
    },


    // precio en unidades monetarias
    // no pueder ser negativo
    price:{
        type:Number,
        required:[true,'el precio es obligatorio'],
        min:[0,'El precio no puede ser negativo']

    },


    description:{ // descripcion de producto -requerido
        type:String,
        required:[true,'la descripcion es requerida'],
        trim:true,
    },
    // Categoria padre esta subcategoria perenece a una categoria 
    // relacion 1-muchos una categoria puede tener muchas subcategorias
    //  un producto pertenece a una subcategoria pero una subcategoria puede tener muchos productos 
    //  relacion 1 a m


    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category', // puede ser poblado con .populate ('Category)
        required:[true,'La categoria es requerida']
    },
    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subCategory', // puede ser poblado con .populate ('subCategory)
        required:[true,'La subCategoria es requerida']
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
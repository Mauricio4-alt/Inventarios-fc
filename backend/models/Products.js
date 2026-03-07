/*
* Modelo de producto - MongoDB
* Define la estructura de los productos dentro de la base de datos.
* Un producto pertenece a:
*   - una categoría
*   - una subcategoría
* También guarda:
*   - usuario que lo creó
*   - imágenes
*   - estado activo
*/

const mongoose = require('mongoose')

// Definición del esquema del producto
const productSchema = new mongoose.Schema({

    // Nombre del producto
    // Debe ser único en la base de datos
    name:{ 
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique:true, // evita productos duplicados
        trim:true // elimina espacios al inicio y final
    },

    // Cantidad disponible en inventario
    stock:{
        type:Number,
        required:[true,'El stock es obligatorio'],
        min:[0,'El stock no puede ser negativo'] // validación
    },

    // Precio del producto
    price:{
        type:Number,
        required:[true,'El precio es obligatorio'],
        min:[0,'El precio no puede ser negativo']
    },

    // Descripción del producto
    description:{
        type:String,
        required:[true,'La descripcion es requerida'],
        trim:true
    },

    // Categoría principal del producto
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category', // relación con el modelo Category
        required:[true,'La categoria es requerida']
    },

    // Subcategoría a la que pertenece
    subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subcategory', // modelo Subcategory
        required:[true,'La subCategoria es requerida']
    },

    // Usuario que creó el producto
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    // Arreglo de imágenes del producto
    images:[{
        type:String // URL de la imagen
    }],

    // Permite activar o desactivar el producto
    active:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true, // agrega createdAt y updatedAt
    versionKey:false // elimina el campo __v
})

/*
* Middleware post-save
* Captura errores de duplicados en índices únicos
* Mongo devuelve error 11000 cuando se viola unique
*/
productSchema.post('save', function (error,doc,next){

    if(error.name === 'MongoServerError' && error.code === 11000){
        return next(new Error('Ya existe un producto con ese nombre'))
    }

    next(error)

})


// Exporta el modelo
module.exports = mongoose.model('Product',productSchema)
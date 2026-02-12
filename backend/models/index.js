/*
* Archivo de indic de los modelos  
* Este archivo centraliza la importacion de los modelos de mongoose
* permite importar multiples modelos de forma concisa en otros archivos
* de froma concisa
*/

const Subcategory = require("./Subcategory")

const User = requiere('./User')
const Product = requiere('./Produc')
const Category = requiere('/Category')

//  Exportar todos los modlos

module.exports = {
    User,
    Product,
    Category,
    Subcategory
}
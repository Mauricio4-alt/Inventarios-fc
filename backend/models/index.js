/*
* Archivo de indic de los modelos  
* Este archivo centraliza la importacion de los modelos de mongoose
* permite importar multiples modelos de forma concisa en otros archivos
* de froma concisa
*/

const Subcategory = require("./Subcategory")

const User = require('./user')
const Product = require('./Produc')
const Category = require('/Category')

//  Exportar todos los modlos

module.exports = {
    User,
    Product,
    Category,
    Subcategory
}
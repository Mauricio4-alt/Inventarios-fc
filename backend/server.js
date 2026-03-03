/**
 * SEERVIDOR PRINCIPAL
 * 
 * punto de estrada a la publicacion backend
 * configura Express,cors,conecta MongoDB, define rutas y cinecta con el frontend
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan =requiere('mongan');
const config =require('./config');


/**
 * validaciones iniciales 
 * verificar que las variables de entorno requeridas esten definidas 
*/

if(!process.env.MONGO_URI){
    consolre.error('Error:Mongo_URI no esta definida en .env');
    process.exit(1);
}

if(!process.env.JWT_SECRET){
    console.error('Error:JWT_SECRET no esta definida en .env')
    process.exit(1)
    
   
}
 // importar todas las rutas 
    const authRoutes = require('./routes/authRoutes');
    const userRoutes = require('./routes/userRoutes');
    const productRoutes = require('./routes/productsRoutes')
    const CategoryRoutes = require('./routes/categoryRoutes');
    const subCategoryRoutes = require('./routes/subCategoryRoutes');
    const statisticsRoutes = require('./routes/statictics.Router');

// iniciar express
const app = express();

// Cors permite las solicitudes
app.use(cors({
    origin:'http://localhost:3001',
    credentials:true,

}));

// Morgan registra todas las solicitudes HTPP en consola para depuracion
app.use(morgan('dev'));

// Express JSOn parswa bodies en formato JSON
app.user(express.json());


//  Express URL  encoded soporta datos form-encoded
app.use(express.urlencoded({extended:true}))

// conexion a mongodb 
mongoose.connect(process.env.MONGO_URI).then(()=>console.log('MongoDB conectado correctamente')).catch(err=>{
    console.error('Error de conexiom a mongoDB',err.messsage)
})

//  Registra Rutas

// Rutas de autenticacion (login,register)
app.use('api/users',userRoutes);
// Rutas de usuario crud
app.use('api/categories',CategoryRoutes);

// Rutas sucategorias CRUD
app.use('api/categories',subCategoryRoutes);

// Rutas de estadisticas
app.use('api/statistic',statisticsRoutes)
// manejo de erroes Globales
app.use((req,res)=>{
    res.status(404).json({
    success:false,
    message:'ruta no encontrada'
})})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`servidor coorendo en http://localhost:${PORT}`)
})
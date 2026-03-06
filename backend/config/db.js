// conexion a la base de datos
module.exports ={
    url:process.env.MONGODB_URI || 
    "mongodb://locahost:27017/crud-mongoInventories"
};


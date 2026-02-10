// conexion a la base de datos
module.exports ={
    url:process.env.MONGODB_URI || 
    "mondb://locahost:27017/crud-mongoInventories"
};


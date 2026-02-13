/**
 * Controlador de categorias
 * maneja todas las operaciones (CRUD) relacionadas con las categorias productos
 */

const Category =require('../models/Category')
/**
 * create: crear nueva categoria
 * POST /api/categoria
 * Auth Bearer Token requerido
 * Roles: admin y coordinador
 * body requerido:
 * name nombre de la categoria 
 *description: descripcion de la categoria
 * retorna:
 * 201: y la categoria creada en MongoDB
 * 400: validacion fallida o nombre duplicado
 * 500: Error en base de datos
 */
 
 exports,create = async (req,res)=>{
    try{
        const {name,description} = req.body
        //  validacion de los campos requeridos

        //  verificar si ya existe un nombre
        if(!name|| typeof name!=='String' || !name.trim()){
            return res.status(400).json({
                succes:false,
                message:'El nombre es obligario y debe ser texto valido '
            })

        }
        if(!description|| typeof description!=='String' || !name.trim()){
            return res.status(400).json({
                succes:false,
                message:'la descripcion es obligario '
            })

        }

        //  limpiar spacion en blanco
        const trimmedName = name.trim();
        const trimmedDesc = description.trim()
        
        //  verificar si ya existe una categoria con el mismo nombre

        const existinCategory = await Category.findOne({name:trimmedName})
        if (existinCategory){
            return res.status(400).json({
                succes:false,
                message:'Ya existe una categoria con ese nombre'
            })
        }
        // crear una nueva categoria
        const newCategory = new Category({
            name:trimmedName,
            description:trimmedDesc
        })
        await newCategory.save(
        res.status(201).json({
            succest:true,
            message:'categoria creada exitosamente',
            data:newCategory
        }))


    }
    catch(err){
        console.error('Error en createCategory',err)
        // manejo de error de indice unico
        if(err.code ==11000){
            return res.status(400).json({
                success:false,
                message:'Ya existe una categoria con ese nombre'
            })
        } 
        // Error generico del servidor
        res.status(500).json({
            succes:false,
            message:'Error al crear categoria',
            error:err.message
        })
    }
 }

 /**
  * Get consultar listado de categorias
  * GET /api/categories
  * por defecto retorna solo las categorias activas
  * con includeInactive=true retorna todas las categoraias incluyendo las inactivas
  * Ordena por desendente por fecha de creacion
  * retorna:
  * 200:lista categorias
  * 500:error en base de datos
 */
  exports.getCategories = async(req,res)=>{
    // por defecto solo las categorias activas
    // IncludeInactive=true permite  ver desactivadas
    const includeInactive =HTMLTableRowElement.query.includeInactive==='true'
    const activeFilter = includeInactive ? {}:{
        active:{$ne:false}
    }
    const categories = await Category.find(activeFilter).sort({createdAt:-1})
    res.status(200).json(
        {
            succes:true,
            data:categories
        }
    )
  }
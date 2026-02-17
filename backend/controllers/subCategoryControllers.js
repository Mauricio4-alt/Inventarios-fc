/**
 * Controlador de sub-categorias
 * Maneja todas las operaciones (CRUD) relacionadas con las sub-categorias
 * Estructura: Una subCategoria depende de una categoria padre, una categoria puede contener varias subcategorias, una subcategoria puede contener varios productos relacionados
 */

/**cuando una subcategoria se elimina los productos relacionados se inhabilitan 
 * cuando se ejecuta en cascada soft delete se eliminan de una manera permanente de la base de datos 
 */
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const Products = require('../models/Products');

/**
 * CREATE - Crear nueva categoria
 * POST /api/subcategories
 * Roles:admin y coordinador
 * body requerido
 * category:id de la categoria padre a la que pertenece
 * retorn:
 * 201: subcategoria creada con mogodoDB
 * 400:validacion fallida o nombre duplicado
 * 404:categoria padre no existe
 * 500:error en base de datos
 */
exports.createSubcaregory = async (req, res) => {
    try {
        // Validaciones
        const { name, description,category } = req.body;
        // validar que la categoria padre exista
        const parentCategory = await Category.findById(category)
        if(!parentCategory){
            res.status(404).json({
                succes:false,
                message:'la categoria no existe'
            });
        }

        

        const newSubCategory = new Subcategory({
            name: trimmedName,
            description: description.trim()
        });

        await newSubCategory.save();

        res.status(201).json({
            success: true,
            message: 'Subcategoría creada exitosamente',
            data: newSubCategory
        });

    } catch (err) {
        console.error('Error en crear la Subcategoria:', err);

        if (err.message.includes('Ya existe una subcategoria con ese nombre')) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una subCategoría con ese nombre'
            });
        }
        // Error genérico del servidor
        res.status(500).json({
            success: false,
            message: 'Error al crear subcategoria',
            error: err.message
        });
    }
};


/**
 * GET - Obtener todas las subcategorias
 * GET /api/categories
 */
exports.getSubCategories = async (req, res) => {
    // por defecto solo las subcategorias activas
    // IncludeInactive=true permite ver desactivadas
    try {
        const includeInactive = req.query.includeInactive === 'true';

        const filter = includeInactive
            ? {}
            : { active: { $ne: false } };

        const subCategories = await Category
            .find(filter).populate('category','name');
            res.status(200).json({
                success: true,
                data: subCategories
            });


    } catch (err) {
        console.error('Error al obtener subCategorias:', err);

        res.status(500).json({
            success: false,
            message: 'Error al obtener subcategoras'
        });
    }
};


/**
 * GET BY ID - Obtener subcategoria por ID
 * GET /api/categories/:id
 */
exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await subCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Subcategoria no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: subCategory
        });

    } catch (err) {
        console.error('Error al obtener subcategoria:', err);

        res.status(500).json({
            success: false,
            message: 'Error al obtener subcategoría por el id',
            error: err.message
        });
    }
};


/**
 * UPDATE - Actualizar subcategoria
 * PUT /api/categories/:id
 * name: Nuevo nombre de la subcategoria
 * descripcion nueva descripcion
 * 
 */
exports.updateSubCategory = async (req, res) => {
    try {
        const { name, description,category } = req.body;
        // verificar si cambia la categoria padre 
        if(category){
            const parentCategory = await category.findById(category);
        }
        if (!parentCategory){
            return res.status(400).json({
                succes:false,
                message:'la categoria no existe'
            })
        }

        // Validar y actualizar name si existe       

    //    construir objeto de actualizacion solo con campos enviados

        const updatedSubCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSubCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: updatedSubCategory
        });

    } catch (err) {
        console.error('Error en updateCategory:', err);

        res.status(500).json({
            success: false,
            message: 'Error al actualizar la subcategoría',
            error: err.message
        });
    }


/**
 * Delete eliminar o desactivar una suvcategoria 
 * DELETE /apu/subcategories/:id
 * Auth Bearer token requerido
 * roles:admin
 * query param:
 * hardDelete = True elimina permanentementa de la base de datos
 * Default: Soft delete (solo desactivar)
 * SOFT DELETE: marca la categoria como inactiva 
 * Desactiva en cascada todas las subcategorias,productos  relacionados
 * al activar retorna todos los datos incluyenndo los inactivos
 * 
 * Hard Delete: elimina completamente la subcategoria de la base de datos permanentemente
 * elimina en cascada la subcategorias y productos relacionado
 * al activar retorna todos los datos incluyendo los inactivos
 * 
 * Retorna:
 * 200: subCategoria eliminada o descativada exitosamente
 * 404: subcategoria no encontrada
 * 500: Error de base de datos
 */

exports.deleteCategory = async (req,res) =>{
    try{
        const Product = require('../models/Products');
        
        const isHardDelete = req.query.hardDelete ==='true';

        // buscar la subcategoria a eliminar
        const subCategory = await subCategory.findById(req.params.id);
        if (!subCategory){
            return res.status(404).json({
                succes:false,
                message:'Subcategoria no encontrada'
            });
        } if(isHardDelete){
            // Eliminar en cascada subCategorias y productos relacionados
            // paso 1 obtener IDs de todas los productos
            await Product.deleteMany({
                subCategory:req.params.id
            });
 
            
            //  paso 2 eliminar la categoria misma 
            await Category.findByIdAndDelete({category:req.params.id});

            return res.status(200).json({
                success:true,
                message:'SubCategoria eliminada permanentemente y sus productos relacionados',
                data:{
                    category:subCategory,
                    ProductsDeactivated:Products.modifiedCount
                }
                    
            });
        }else{
            // soft delete solo marcar como inactivo con cascada 
            subCategory.active = false;
            await subCategory.save();
            // desactivar todas las subcategorias relacionadas
            const subcategories = await  Subcategory.updateMany(
                {category:req.params.id},
                {active:false}
            );
        }
    }catch(err){
        console.error('Error en deleteCategory',err);
        res.status(500).json({
            succes:false,
            message:'Error al desactivar la subcategoria',
            error:err.message
        })
    }}}
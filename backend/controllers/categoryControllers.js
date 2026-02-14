/**
 * Controlador de categorias
 * Maneja todas las operaciones (CRUD) relacionadas con las categorias
 */

const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

/**
 * CREATE - Crear nueva categoria
 * POST /api/categoria
 */
exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validaciones
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es obligatorio y debe ser texto válido'
            });
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'La descripción es obligatoria y debe ser texto válido'
            });
        }

        const trimmedName = name.trim();
        const trimmedDesc = description.trim();

        // Verificar duplicado
        const existingCategory = await Category.findOne({ name: trimmedName });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        const newCategory = new Category({
            name: trimmedName,
            description: trimmedDesc
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: newCategory
        });

    } catch (err) {
        console.error('Error en createCategory:', err);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear categoría',
            error: err.message
        });
    }
};


/**
 * GET - Obtener todas las categorias
 * GET /api/categories
 */
exports.getCategories = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';

        const filter = includeInactive
            ? {}
            : { active: { $ne: false } };

        const categories = await Category
            .find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (err) {
        console.error('Error en getCategories:', err);

        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías'
        });
    }
};


/**
 * GET BY ID - Obtener categoria por ID
 * GET /api/categories/:id
 */
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (err) {
        console.error('Error en getCategoryById:', err);

        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría',
            error: err.message
        });
    }
};


/**
 * UPDATE - Actualizar categoria
 * PUT /api/categories/:id
 */
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = {};

        // Validar y actualizar name si existe
        if (name) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre debe ser texto válido'
                });
            }

            const trimmedName = name.trim();

            // Verificar duplicado
            const existing = await Category.findOne({
                name: trimmedName,
                _id: { $ne: req.params.id }
            });

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Este nombre ya existe'
                });
            }

            updateData.name = trimmedName;
        }

        // Validar y actualizar description si existe
        if (description) {
            if (typeof description !== 'string' || !description.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'La descripción debe ser texto válido'
                });
            }

            updateData.description = description.trim();
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: updatedCategory
        });

    } catch (err) {
        console.error('Error en updateCategory:', err);

        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoría',
            error: err.message
        });
    }
};

/**
 * Delete eliminar o desactivar una categoria 
 * DELETE /apu/categories/:id
 * Auth Bearer token requerido
 * roles:admin
 * query param:
 * hardDelete = True elimina permanentementa de la base de datos
 * Default: Soft delete (solo desactivar)
 * SOFT DELETE: marca la categoria como inactiva 
 * Desactiva en cascada todas las subcaegorias,productos  relacionados
 * al activar retorna todos los datos incluyenndo los inactivos
 * 
 * Hard Delete: elimina completamente la categoria de la base de datos permanentemente
 * elimina en cascada la categoria, subcategorias y productos relacionado
 * No se puede recuperar
 * 
 * Retorna:
 * 200: Categoria eliminada o descativada exitosamente
 * 404: categoria no encontrada
 * 500: Error de base de datos
 */

exports.deleteCategory = async (req,res) =>{
    try{
        const SubCategory = require('../models/Subcategory');
        const Product = require('../models/Products');
        const hardDelete = req.query.hardDelete ==='true';

        // buscar la categoria a eliminar
        const category = await Category.findById(req.params.id);
        if (!category){
            return res.status(404).json({
                succes:false,
                message:'Categoria no encontrada'
            })
        } if(isHardDelete){
            // Eliminar en cascada subCategotias y productos relacionados
            // paso 1 obtener IDs de todas las subcategorias
            const subIds = (await SubCategory.find({
                category:req.params.id
            })).map(s=>s._id);
            // paso 2 eliminar todos los productos
            await  Product.deleteMany({ category: req.params.id });

            //  paso 3 eliminar todos de subcategorias
            await Product.deleteMany({ SubCategory: { $in: subIds}});
            //  paso 4 eliminar todas las subcategorias de esta categoria
            await Subcategory.deleteMany({
                category:req.params.id
            });
            //  paso 5 eliminar la categoria misma 
            await Category.findByIdAndDelete({category:req.params.id});

            res.status(200).json({
                success:true,
                message:'Categoria eliminada permanentemente y sus subcategorias y productos relacionados',
                data:{
                    category:category,
                    subcategoriesDeactivated:subcategories.modifiedCount,
                    productsDeactivated:producs.modifiedCount
                }
            });
        }else{
            // soft delete solo marcar como inactivo con cascada 
            category.active = false;
            await category.save();
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
            message:'Error al eliminar la categoria',
            error:err.message
        })
    }

}
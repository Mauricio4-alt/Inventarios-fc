/**
 * Controlador de productos
 * Maneja todas las operaciones CRUD relacionadas con los productos
 *
 * Relaciones:
 * - Una categoría puede tener muchas subcategorías
 * - Una subcategoría pertenece a una categoría
 * - Un producto pertenece a una categoría y una subcategoría
 *
 * Incluye:
 * - Soft Delete (desactivar producto)
 * - Hard Delete (eliminación permanente)
 */

const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const Product = require('../models/Products');


/**
 * CREATE
 * Crear un nuevo producto
 * POST /api/products
 */
exports.createProduct = async (req, res) => {

    try {

        // Extraer datos del body
        const { name, description, price, stock, category, subCategory } = req.body;

        /**
         * ===== VALIDACIÓN DE CAMPOS =====
         */

        if (!name || !description || !price || !stock || !category || !subCategory) {

            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios',
                requiredFields: ['name','description','price','stock','category','subCategory']
            });
        }


        /**
         * ===== VALIDAR CATEGORÍA =====
         */

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success:false,
                message:'La categoría padre no existe'
            });
        }


        /**
         * ===== VALIDAR SUBCATEGORÍA =====
         * además se valida que pertenezca a la categoría
         */

        const subcategoryExists = await Subcategory.findOne({
            _id: subCategory,
            category: category
        });

        if (!subcategoryExists) {
            return res.status(400).json({
                success:false,
                message:'La subcategoría no existe o no pertenece a la categoría'
            });
        }


        /**
         * ===== CREAR PRODUCTO =====
         */

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            subCategory
        });


        /**
         * Registrar usuario creador si existe autenticación
         */

        if (req.user && req.user_id) {
            product.createdBy = req.user_id;
        }


        /**
         * Guardar en MongoDB
         */

        const savedProduct = await product.save();


        /**
         * Populate de relaciones
         */

        const productWithDetails = await Product.findById(savedProduct._id)
            .populate('category','name')
            .populate('subCategory','name')
            .populate('createdBy','username email');


        return res.status(201).json({
            success:true,
            message:'Producto creado exitosamente',
            data:productWithDetails
        });


    } catch(error){

        console.error('Error en createProduct', error);

        /**
         * Manejar error de duplicado
         */

        if(error.code === 11000){
            return res.status(400).json({
                success:false,
                message:'Ya existe un producto con ese nombre'
            });
        }

        res.status(500).json({
            success:false,
            message:'Error al crear el producto',
            error:error.message
        });
    }
};



/**
 * READ
 * Obtener lista de productos
 * GET /api/products
 */

exports.getProducts = async (req,res) => {

    try {

        /**
         * Query param para incluir productos inactivos
         */

        const includeInactive = req.query.includeInactive === 'true';

        const filter = includeInactive ? {} : { active: true };


        /**
         * Buscar productos
         */

        const products = await Product.find(filter)
            .populate('category','name')
            .populate('subCategory','name')
            .sort({ createdAt:-1 });


        /**
         * Ocultar usuario creador si es auxiliar
         */

        if(req.user && req.user.role === 'auxiliar'){

            products.forEach(product => {
                product.createdBy = undefined;
            });

        }


        res.status(200).json({

            success:true,
            count:products.length,
            data:products

        });

    } catch(error){

        console.error('Error en getProducts', error);

        res.status(500).json({

            success:false,
            message:'Error al obtener productos',
            error:error.message

        });
    }
};



/**
 * READ BY ID
 * GET /api/products/:id
 */

exports.getProductById = async (req,res) => {

    try{

        const product = await Product.findById(req.params.id)
            .populate('category','name description')
            .populate('subCategory','name description');


        if(!product){

            return res.status(404).json({

                success:false,
                message:'Producto no encontrado'

            });

        }


        /**
         * ocultar creador si es auxiliar
         */

        if(req.user && req.user.role === 'auxiliar'){
            product.createdBy = undefined;
        }


        res.status(200).json({

            success:true,
            data:product

        });


    }catch(error){

        console.error('Error en getProductById',error);

        res.status(500).json({

            success:false,
            message:'Error al obtener producto',
            error:error.message

        });
    }
};



/**
 * UPDATE
 * PUT /api/products/:id
 */

exports.updateProduct = async (req,res) => {

    try{

        const { name, description, price, stock, category, subCategory } = req.body;

        const updateData = {};


        /**
         * Solo actualizar campos enviados
         */

        if(name) updateData.name = name;
        if(description) updateData.description = description;
        if(price) updateData.price = price;
        if(stock) updateData.stock = stock;
        if(category) updateData.category = category;
        if(subCategory) updateData.subCategory = subCategory;


        /**
         * Validar relaciones
         */

        if(category){

            const categoryExists = await Category.findById(category);

            if(!categoryExists){

                return res.status(400).json({

                    success:false,
                    message:'La categoría no existe'

                });
            }

        }


        if(subCategory){

            const subcategoryExists = await Subcategory.findOne({

                _id:subCategory,
                category:category || updateData.category

            });

            if(!subcategoryExists){

                return res.status(400).json({

                    success:false,
                    message:'La subcategoría no pertenece a la categoría'

                });
            }

        }


        /**
         * Actualizar producto
         */

        const updatedProduct = await Product.findByIdAndUpdate(

            req.params.id,
            updateData,
            { new:true, runValidators:true }

        )
        .populate('category','name')
        .populate('subCategory','name')
        .populate('createdBy','username email');


        if(!updatedProduct){

            return res.status(404).json({

                success:false,
                message:'Producto no encontrado'

            });

        }


        res.status(200).json({

            success:true,
            message:'Producto actualizado',
            data:updatedProduct

        });


    }catch(error){

        console.error('Error en updateProduct',error);

        res.status(500).json({

            success:false,
            message:'Error al actualizar producto',
            error:error.message

        });

    }

};



/**
 * DELETE
 * DELETE /api/products/:id
 *
 * Soft Delete → active=false
 * Hard Delete → eliminar documento
 */

exports.deleteProduct = async (req,res) => {

    try{

        const isHardDelete = req.query.hardDelete === 'true';

        const product = await Product.findById(req.params.id);

        if(!product){

            return res.status(404).json({

                success:false,
                message:'Producto no encontrado'

            });

        }


        /**
         * HARD DELETE
         */

        if(isHardDelete){

            await Product.findByIdAndDelete(req.params.id);

            return res.status(200).json({

                success:true,
                message:'Producto eliminado permanentemente'

            });

        }


        /**
         * SOFT DELETE
         */

        product.active = false;

        await product.save();


        res.status(200).json({

            success:true,
            message:'Producto desactivado correctamente',
            data:product

        });


    }catch(error){

        console.error('Error en deleteProduct',error);

        res.status(500).json({

            success:false,
            message:'Error al eliminar producto',
            error:error.message

        });

    }

};
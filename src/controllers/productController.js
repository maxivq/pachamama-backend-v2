import Product from '../models/Product.js';

export async function getProducts(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const { category, all, q } = req.query;

    const filters = {};
    if (category) {
      filters.category = category;
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filters.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    const baseQuery = Product.find(filters).sort({ createdAt: -1 });

    let items;
    let total;

    if (all === 'true') {
      [items, total] = await Promise.all([
        baseQuery,
        Product.countDocuments(filters),
      ]);

      return res.json({
        items,
        total,
        page: 1,
        limit: total,
        totalPages: 1,
      });
    }

    const skip = (page - 1) * limit;

    [items, total] = await Promise.all([
      baseQuery.skip(skip).limit(limit),
      Product.countDocuments(filters),
    ]);

    return res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    return res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    return res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

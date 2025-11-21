export function filterProducts(products, { category, q } = {}) {
  return products.filter((p) => {
    if (category && p.category !== category) {
      return false;
    }

    if (q) {
      const text = `${p.title || ''} ${p.description || ''}`.toLowerCase();
      const query = q.toLowerCase();
      if (!text.includes(query)) {
        return false;
      }
    }

    return true;
  });
}
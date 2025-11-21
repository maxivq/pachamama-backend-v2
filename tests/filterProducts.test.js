import { filterProducts } from '../src/utils/filterProducts.js';

const mockProducts = [
  { title: 'Alfajor de maicena', description: 'Rico y casero', category: 'Alfajores' },
  { title: 'Galletitas integrales', description: 'Con semillas', category: 'Galletitas' },
  { title: 'Alfajor sin TACC', description: 'Apto celíacos', category: 'Alfajores' },
];

test('sin filtros devuelve todos los productos', () => {
  const resultado = filterProducts(mockProducts, {});
  expect(resultado.length).toBe(3);
});

test('filtra por categoría', () => {
  const resultado = filterProducts(mockProducts, { category: 'Alfajores' });
  expect(resultado.length).toBe(2);
  expect(resultado.every((p) => p.category === 'Alfajores')).toBe(true);
});

test('filtra por texto de búsqueda', () => {
  const resultado = filterProducts(mockProducts, { q: 'galletitas' });
  expect(resultado.length).toBe(1);
  expect(resultado[0].title).toBe('Galletitas integrales');
});

test('combina categoría y texto', () => {
  const resultado = filterProducts(mockProducts, { category: 'Alfajores', q: 'sin tacc' });
  expect(resultado.length).toBe(1);
  expect(resultado[0].title).toBe('Alfajor sin TACC');
});
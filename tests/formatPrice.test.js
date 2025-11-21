import { formatPrice } from '../src/utils/formatPrice.js';

test('formatea el precio a 2 decimales', () => {
  const resultado = formatPrice(12.3456);
  expect(resultado).toBe(12.35);
});
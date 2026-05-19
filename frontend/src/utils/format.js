const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => brl.format(value ?? 0);

export const formatArea = (m2) =>
  `${new Intl.NumberFormat('pt-BR').format(m2 ?? 0)} m²`;

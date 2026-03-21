export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const pluralize = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

export const escapeHtml = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

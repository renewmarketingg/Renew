export const generateId = (prefix = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
};

export const generateProductId = (): string => generateId('prod');

export const generateCartId = (): string => generateId('cart');

export const generateSessionId = (): string => generateId('v');

export const formatCurrency = (amount) => {
  const numeric = Number(amount) || 0;
  return `R ${numeric.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

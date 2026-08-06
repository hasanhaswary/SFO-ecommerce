export const showToast = (message, type = 'info') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: ${type === 'success' ? '#1b4d2e' : type === 'error' ? '#5c1d1d' : '#1e2d24'};
    color: #ffffff;
    border-left: 4px solid ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    padding: 12px 20px;
    font-family: var(--font-mono, monospace);
    font-size: 0.85rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 280px;
    animation: slideIn 0.3s ease;
  `;

  toast.innerHTML = `
    <span>${message}</span>
    <button style="background:none; border:none; color:#fff; cursor:pointer; margin-left:12px;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};

export const formatCurrency = (amount) => {
  const numeric = Number(amount) || 0;
  return `R ${numeric.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

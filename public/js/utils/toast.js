/**
 * Toast Notification Engine
 * Displays stylish transient toast messages for actions, alerts, and system feedback.
 */
export function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? '#ba1a1a' : type === 'success' ? '#1b8045' : '#051a0f';
  toast.style.cssText = `
    background-color: ${bgColor};
    color: #ffffff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    padding: 12px 20px;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 4px 4px 0px #000000;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.2s ease;
  `;
  toast.innerText = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  }, 4000);
}

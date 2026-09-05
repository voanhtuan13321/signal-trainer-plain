export function renderButton({ label, className = "", type = "button", attributes = "" }) {
  return `<button class="button ${className}" type="${type}" ${attributes}>${label}</button>`;
}

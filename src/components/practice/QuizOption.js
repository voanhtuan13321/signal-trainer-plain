export function renderQuizOption({ value, disabled = false, result = "" }) {
  const resultClass = result ? ` is-${result}` : "";
  return `<button class="option${resultClass}" type="button" data-answer="${String(value)}"${disabled ? " disabled" : ""}>${String(value)}</button>`;
}

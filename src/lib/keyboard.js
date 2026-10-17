/** True when a browser or OS shortcut modifier is held (Ctrl+1 switches tabs, etc.). */
export function hasShortcutModifier(event) {
  return event.ctrlKey || event.metaKey || event.altKey;
}

/**
 * True when focus is on a control that already handles Space/Enter itself;
 * hijacking those keys would break activation or fire the action twice.
 */
export function isOnControl(event) {
  return event.target instanceof Element &&
    Boolean(event.target.closest("button, a, input, select, textarea, [role='tab']"));
}

/**
 * Map keys 1-4 to the matching option, or undefined for any other key.
 * Auto-repeat is ignored so a held key cannot answer the next question too.
 */
export function getOptionForKey(event, options) {
  if (event.repeat || !/^[1-4]$/.test(event.key)) return undefined;
  return options[Number(event.key) - 1];
}

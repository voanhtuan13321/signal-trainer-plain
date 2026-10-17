const PREFIX = "signal-trainer:";

/** localStorage can be missing or throw (private mode, blocked site data). */
function getDefaultStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Read a saved best score. Anything missing, corrupt or negative counts as 0.
 *
 * @param {string} key
 * @param {Pick<Storage, "getItem"> | null} [storage]
 */
export function loadBest(key, storage = getDefaultStorage()) {
  try {
    const value = Number(storage?.getItem(PREFIX + key));
    return Number.isInteger(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

/**
 * Save a best score. Failures are swallowed: losing a high score must never
 * break the game.
 *
 * @param {string} key
 * @param {number} value
 * @param {Pick<Storage, "setItem"> | null} [storage]
 * @returns {boolean} Whether the value was stored.
 */
export function saveBest(key, value, storage = getDefaultStorage()) {
  try {
    if (!storage) return false;
    storage.setItem(PREFIX + key, String(value));
    return true;
  } catch {
    return false;
  }
}

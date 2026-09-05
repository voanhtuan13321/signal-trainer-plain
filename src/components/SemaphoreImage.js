import { SEMAPHORE_IMAGES } from "../data/signals.js";

/**
 * Render a Semaphore image tag for a known character.
 *
 * Missing characters return an empty string so view renderers can stay simple
 * and avoid leaking broken image icons into the quiz UI.
 */
export function renderSemaphoreImage(character, className = "semaphore__image") {
  const imagePath = SEMAPHORE_IMAGES[character];

  if (!imagePath) {
    return "";
  }

  return `<img class="${className}" src="${imagePath}" alt="Semaphore ${character}">`;
}

import { SEMAPHORE_POSES } from "../../data/semaphore.js";
import { renderSemaphoreSvg } from "../../lib/semaphore-svg.js";

/**
 * Render a Semaphore image tag for a known character.
 *
 * Missing characters return an empty string so view renderers can stay simple
 * and avoid leaking broken image icons into the quiz UI.
 */
export function renderSemaphoreImage(character, className = "semaphore__image") {
  const svg = renderSemaphoreSvg(character, SEMAPHORE_POSES);
  return svg ? svg.replace('class="semaphore-svg"', `class="semaphore-svg ${className}"`) : "";
}

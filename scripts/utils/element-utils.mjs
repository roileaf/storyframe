/**
 * Element Utilities
 * Helper functions for extracting and manipulating DOM elements
 */

/**
 * Extract HTMLElement from various formats (jQuery, array, raw element)
 * @param {*} html - The element in various possible formats
 * @param {*} fallback - Optional fallback object with .element property
 * @returns {HTMLElement|null}
 */
export function extractElement(html, fallback = null) {
  if (Array.isArray(html)) return html[0];
  if (html instanceof HTMLElement) return html;
  if (html?.jquery) return html[0];

  if (fallback?.element) {
    const elem = fallback.element;
    return elem?.jquery ? elem[0] : elem;
  }

  return null;
}

/**
 * Selector for journal content StoryFrame should skip (decorative images, styled boxes).
 * Matches the element itself or any ancestor, so a wrapper can exclude everything inside it.
 */
export const STORYFRAME_IGNORE_SELECTOR =
  '.storyframe-ignore, [data-storyframe-ignore], [data-tag="storyframe-ignore"]';

/**
 * Check whether a journal element has been marked to be ignored by StoryFrame.
 * @param {Element} element
 * @returns {boolean}
 */
export function isStoryFrameIgnored(element) {
  return !!element?.closest?.(STORYFRAME_IGNORE_SELECTOR);
}

/**
 * Extract parent element from sheet/application interface.
 * Handles ApplicationV2 apps that may return a sub-element (e.g. MEJ returns a header button)
 * by traversing up to the .application root or falling back to DOM lookup by app ID.
 * @param {*} parentInterface - The parent interface object
 * @returns {HTMLElement|null}
 */
export function extractParentElement(parentInterface) {
  if (!parentInterface?.element) return null;

  let element = parentInterface.element;
  if (element?.jquery) element = element[0];
  if (element?.[0] instanceof HTMLElement) element = element[0];
  if (!(element instanceof HTMLElement)) return null;

  // If the element is not the application root, find it
  if (!element.classList.contains('application') && !element.classList.contains('window-app')) {
    const appRoot = element.closest('.application');
    if (appRoot) return appRoot;

    // Fallback: DOM lookup by app ID (ApplicationV2)
    const appId = parentInterface.options?.id || parentInterface.id;
    if (appId) {
      const found = document.getElementById(appId);
      if (found) return found;
    }
  }

  return element;
}

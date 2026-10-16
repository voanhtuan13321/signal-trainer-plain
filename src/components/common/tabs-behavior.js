/**
 * Roving-tabindex keyboard support for every tablist inside `root`, using one
 * delegated listener so it survives innerHTML redraws.
 *
 * Arrow keys only move within the tablist that owns the focused tab, so a
 * second tablist on the page (e.g. inside a dialog) is never reached by accident.
 *
 * @returns {() => void} Function that removes the listener.
 */
export function bindTablistKeyboard(root) {
  function onKeydown(event) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const tab = event.target.closest?.('[role="tab"]');
    const tablist = tab?.closest('[role="tablist"]');
    if (!tablist) return;

    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(tabs.indexOf(tab) + delta + tabs.length) % tabs.length];

    event.preventDefault();
    next.click();
    // Click handlers may redraw the page, so look the tab up again by id.
    (document.getElementById(next.id) || next).focus();
  }

  root.addEventListener("keydown", onKeydown);
  return () => root.removeEventListener("keydown", onKeydown);
}

/**
 * Update active class, aria-selected and tabindex together for in-place tab
 * switches that do not redraw the tablist.
 */
export function setActiveTab(tablist, activeTab) {
  tablist.querySelectorAll('[role="tab"]').forEach((tab) => {
    const active = tab === activeTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
}

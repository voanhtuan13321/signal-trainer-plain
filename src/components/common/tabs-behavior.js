/**
 * Roving-tabindex keyboard support for every tablist inside `root`.
 *
 * Arrow keys only move within the tablist that owns the focused tab, so a
 * second tablist on the page (e.g. inside a dialog) is never reached by accident.
 */
export function bindTablistKeyboard(root) {
  root.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    tablist.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const tab = event.target.closest('[role="tab"]');
      if (!tab) return;

      const tabs = [...tablist.querySelectorAll('[role="tab"]')];
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(tabs.indexOf(tab) + delta + tabs.length) % tabs.length];

      event.preventDefault();
      next.click();
      // Click handlers may redraw the page, so look the tab up again by id.
      (document.getElementById(next.id) || next).focus();
    });
  });
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

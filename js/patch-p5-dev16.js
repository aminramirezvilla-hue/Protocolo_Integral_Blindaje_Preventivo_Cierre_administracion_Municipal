'use strict';

/* CATU E-R — P5-BL-003 / CIE-02 hotfix
 * Runtime: 0.1.8-dev.1
 * Load AFTER patch-p5-dev15.js.
 *
 * Purpose:
 * - Make modal close controls truly non-submitting.
 * - Close control/evidence dialogs explicitly.
 * - Bypass native HTML5 form validation on Close / X.
 * - Never persist state when closing.
 * - Survive dynamic re-rendering of modal buttons.
 */

(() => {
  const VERSION = '0.1.8-dev.1';
  const HOTFIX = 'CIE-02-CLOSE-DELEGATED-v1.0';
  const INSTALL_FLAG = '__CATU_CIE02_DEV16_INSTALLED__';

  if (window[INSTALL_FLAG]) {
    console.info(`[CATU E-R] ${HOTFIX} already installed`);
    return;
  }
  window[INSTALL_FLAG] = true;

  const FORM_IDS = new Set(['controlForm', 'evidenceForm']);

  function isManagedCancelButton(btn) {
    if (!(btn instanceof HTMLButtonElement)) return false;
    const form = btn.form || btn.closest('form');
    if (!form || !FORM_IDS.has(form.id)) return false;

    const value = String(btn.value || btn.getAttribute('value') || '').trim().toLowerCase();
    const text = String(btn.textContent || '').trim();
    const aria = String(btn.getAttribute('aria-label') || '').trim().toLowerCase();

    return (
      value === 'cancel' ||
      /^cerrar$/i.test(text) ||
      /^(×|✕|✖|x)$/i.test(text) ||
      aria === 'cerrar' ||
      aria === 'close'
    );
  }

  function normalizeCancelButtons(root = document) {
    const buttons = root.querySelectorAll?.(
      '#controlForm button[value="cancel"], #evidenceForm button[value="cancel"]'
    ) || [];

    buttons.forEach(btn => {
      btn.type = 'button';
      btn.setAttribute('type', 'button');
      btn.dataset.p5Dev16CloseNormalized = '1';
    });
  }

  function closeOwningDialog(btn) {
    const form = btn.form || btn.closest('form');
    const dialog =
      btn.closest('dialog') ||
      form?.closest('dialog') ||
      null;

    if (!dialog) {
      console.error(
        '[CATU E-R] CIE-02 dev16: no se encontró <dialog> contenedor; cierre abortado sin persistir.',
        { button: btn, form }
      );
      return false;
    }

    if (typeof dialog.close !== 'function') {
      console.error(
        '[CATU E-R] CIE-02 dev16: el contenedor no expone dialog.close(); cierre abortado sin persistir.',
        dialog
      );
      return false;
    }

    try {
      dialog.close('cancel');
      console.info(
        `[CATU E-R] CIE-02 dev16: cierre explícito sin submit (${form?.id || 'form desconocido'}).`
      );
      return true;
    } catch (err) {
      console.error('[CATU E-R] CIE-02 dev16: error al cerrar dialog.', err);
      return false;
    }
  }

  // Capture-phase delegation: intercepts Close / X before native form validation.
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element
        ? event.target.closest('button')
        : null;

      if (!target || !isManagedCancelButton(target)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      // Normalize the concrete button as an additional semantic safeguard.
      target.type = 'button';
      target.setAttribute('type', 'button');
      target.dataset.p5Dev16CloseNormalized = '1';

      closeOwningDialog(target);
    },
    true
  );

  // Dynamic modal renderings can recreate the buttons as type=submit.
  // Keep their semantic type correct after any DOM mutation.
  const observer = new MutationObserver(() => normalizeCancelButtons());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  normalizeCancelButtons();

  function stamp() {
    if (typeof state === 'undefined' || !state) return;
    state.version = VERSION;
    state.workspace ||= {};
    state.workspace.runtimeVersion = VERSION;
    state.workspace.storageNamespace = 'p5-preview::';
    state.workspace.releaseTrack = 'P5';
    state.workspace.cie02Hotfix = HOTFIX;
  }

  if (typeof loadData === 'function') {
    const baseLoadData = loadData;
    loadData = async function (...args) {
      const result = await baseLoadData.apply(this, args);
      stamp();
      if (typeof idbSet === 'function' && typeof STATE_KEY !== 'undefined') {
        await idbSet(STATE_KEY, state);
      }
      normalizeCancelButtons();
      return result;
    };
  }

  if (typeof saveState === 'function') {
    const baseSaveState = saveState;
    saveState = async function (...args) {
      const result = await baseSaveState.apply(this, args);
      stamp();
      if (typeof idbSet === 'function' && typeof STATE_KEY !== 'undefined') {
        await idbSet(STATE_KEY, state);
      }
      return result;
    };
  }

  window.CATU_CIE02_HOTFIX = HOTFIX;
  window.CATU_CIE02_NORMALIZE_CLOSE = normalizeCancelButtons;
  window.CATU_CIE02_CLOSE_EXPLICIT = closeOwningDialog;

  console.info(`[CATU E-R] ${HOTFIX} loaded · runtime ${VERSION}`);
})();

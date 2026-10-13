'use strict';

/* CATU E-R — P5-BL-003 / CIE-02 hotfix
 * Proposed runtime: 0.1.4-dev.15
 * Loaded AFTER patch-p5-dev14.js.
 * Decouples modal close actions from native form submission/validation.
 */

const P5_DEV15_VERSION = '0.1.4-dev.15';
const P5_DEV15_HOTFIX = 'CIE-02-CLOSE-NO-SUBMIT-v1.0';

function p5Dev15Stamp() {
  if (typeof state === 'undefined' || !state) return;
  state.version = P5_DEV15_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV15_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.cie02Hotfix = P5_DEV15_HOTFIX;
}

function p5Dev15NormalizeCloseButtons() {
  const anchor =
    document.getElementById('dlgStatus') ||
    document.getElementById('dlgEvidenceStatus') ||
    document.getElementById('dlgScenario') ||
    document.getElementById('dlgRoute') ||
    document.getElementById('dlgOic');

  if (!anchor) return;

  const dialogRoot =
    anchor.closest('dialog') ||
    anchor.closest('[role="dialog"]') ||
    anchor.closest('.modal') ||
    anchor.closest('.dialog') ||
    anchor.closest('form') ||
    anchor.parentElement;

  if (!dialogRoot) return;

  Array.from(dialogRoot.querySelectorAll('button')).forEach((btn) => {
    const text = String(btn.textContent || '').trim();
    const aria = String(btn.getAttribute('aria-label') || '').trim().toLowerCase();
    const title = String(btn.getAttribute('title') || '').trim().toLowerCase();

    const isClose =
      /^cerrar$/i.test(text) ||
      /^(×|✕|✖|x)$/i.test(text) ||
      aria === 'cerrar' || aria === 'close' ||
      title === 'cerrar' || title === 'close';

    if (isClose) {
      btn.setAttribute('type', 'button');
      btn.dataset.p5Dev15CloseNormalized = '1';
    }
  });
}

if (typeof openControl === 'function') {
  const p5Dev15BaseOpenControl = openControl;
  openControl = function(id) {
    const result = p5Dev15BaseOpenControl(id);
    p5Dev15NormalizeCloseButtons();
    Promise.resolve().then(p5Dev15NormalizeCloseButtons);
    return result;
  };
}

p5Dev15NormalizeCloseButtons();

if (typeof loadData === 'function') {
  const p5Dev15BaseLoadData = loadData;
  loadData = async function() {
    await p5Dev15BaseLoadData();
    p5Dev15Stamp();
    if (typeof idbSet === 'function' && typeof STATE_KEY !== 'undefined') {
      await idbSet(STATE_KEY, state);
    }
  };
}

if (typeof saveState === 'function') {
  const p5Dev15BaseSaveState = saveState;
  saveState = async function(logEntry) {
    await p5Dev15BaseSaveState(logEntry);
    p5Dev15Stamp();
    if (typeof idbSet === 'function' && typeof STATE_KEY !== 'undefined') {
      await idbSet(STATE_KEY, state);
    }
  };
}

window.CATU_CIE02_HOTFIX = P5_DEV15_HOTFIX;
window.CATU_CIE02_NORMALIZE_CLOSE = p5Dev15NormalizeCloseButtons;

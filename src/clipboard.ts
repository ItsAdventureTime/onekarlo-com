/* ============================================================================
   Clipboard helpers with a browser-safe fallback - onekarlo.com
   ============================================================================ */

export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy browser fallback below.
  }

  const fallbackInput = document.createElement('textarea');
  fallbackInput.className = 'clipboard-fallback-input';
  fallbackInput.value = text;
  fallbackInput.setAttribute('readonly', 'true');
  fallbackInput.setAttribute('aria-hidden', 'true');
  document.body.appendChild(fallbackInput);
  fallbackInput.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  fallbackInput.remove();
  return copied;
}

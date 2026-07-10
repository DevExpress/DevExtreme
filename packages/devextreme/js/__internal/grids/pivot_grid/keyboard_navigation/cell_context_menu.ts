const F10_KEY = 'F10';
const CONTEXT_MENU_KEY = 'ContextMenu';

export function isContextMenuKeyEvent(
  event: Pick<KeyboardEvent, 'key' | 'shiftKey'>,
): boolean {
  return event.key === CONTEXT_MENU_KEY || (event.shiftKey && event.key === F10_KEY);
}

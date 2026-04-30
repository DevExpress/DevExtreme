export const REMOVE_DEBUG_REGEXP: RegExp = /\/{2,}\s{0,}#DEBUG[\s\S]*?\/{2,}\s{0,}#ENDDEBUG/g;

export function stripDebug(content: string): string {
  return content.replace(REMOVE_DEBUG_REGEXP, '');
}

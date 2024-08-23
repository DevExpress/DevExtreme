import type { Message } from '@js/ui/chat';

const mp = new WeakMap<Message, number>();

let i = 0;

export function getMessageKey(m: Message): number {
  if (mp.has(m)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return mp.get(m)!;
  }

  i += 1;
  mp.set(m, i);
  return i;
}

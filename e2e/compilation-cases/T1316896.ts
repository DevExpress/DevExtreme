import { ArrayStore } from 'devextreme/common/data';

interface Entity {
  id?: string;
  name?: string;
}

type Change<TItem, TKey> = {
  type: 'insert' | 'update' | 'remove';
  data?: TItem;
  key?: TKey;
  index?: number;
};

function notify(changes: Array<Change<Entity, string>>): void {
  const change = changes[0];
  if (change?.data?.id && change.key) {
    const identifier: string = change.key;
    const newId: string = change.data.id;

    const ensureString: string = `${identifier}:${newId}`;
    // eslint-disable-next-line no-console
    // console.log(ensureString);
  }
}

const store = new ArrayStore<Entity, string>({
  key: 'id',
  data: [{ id: '1', name: 'Initial' }],
  onPush: notify,
});

function load(items: Entity[]): void {
  const changes: Array<Change<Entity, string>> = items.map((data): Change<Entity, string> => ({
    key: data.id,
    data,
    type: 'insert',
  }));

  store.push(changes);
}

function pushSingle(): void {
  store.push([
    {
      key: '2',
      data: { id: '2', name: 'New entity' },
      type: 'insert',
    },
  ]);
}

load([{ id: '3', name: 'Batch load' }]);
pushSingle();

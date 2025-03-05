import {
  ODataStore, CustomStore, Store, LoadOptions,
} from 'devextreme/common/data';

// Remove the 'ts-expect-error' below to see the current issue:
// Entity is not compatible with DeepPartial<Entity>
function initCustomStore<Entity, Id>(oDataStore: ODataStore<Entity, Id>): Store<Entity, Id> {
  const customStore = new CustomStore<Entity, Id>({
    key: 'id',
    byKey: (key: Id) => oDataStore.byKey(key),
    insert: (e: Entity) => oDataStore.insert(e),
    load: (options: LoadOptions<Entity>) => oDataStore.load(options),
    remove: (key: Id) => oDataStore.remove(key),
    totalCount: (obj) => oDataStore.totalCount(obj),
    update: (key: Id, updated: Entity) => oDataStore.update(key, updated),
  });
  return customStore;
}

// If this TS issue is fixed: https://github.com/microsoft/TypeScript/issues/23132
// there will be a good workaround to use type constraints to make such an assignment possible
function initCustomStore3<Entity extends object, Id>(
  oDataStore: ODataStore<Entity, Id>,
): Store<Entity, Id> {
  const customStore = new CustomStore<Entity, Id>({
    key: 'id',
    byKey: (key: Id) => oDataStore.byKey(key),
    insert: (e: Entity) => oDataStore.insert(e),
    load: (options: LoadOptions<Entity>) => oDataStore.load(options),
    remove: (key: Id) => oDataStore.remove(key),
    totalCount: (obj) => oDataStore.totalCount(obj),
    update: (key: Id, updated: Entity) => oDataStore.update(key, updated),
  });
  return customStore;
}

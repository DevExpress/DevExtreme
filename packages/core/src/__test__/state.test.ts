import { createState } from '../state';

describe('Core: Component: state', () => {
  it('Returns state value', () => {
    const initialValue = { model: { value: 'test' }, dictionary: { value: 'test' } };
    const state = createState(initialValue);

    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });

  it('Updates the state value', () => {
    const initialValue = { model: { value: 'test' }, dictionary: { value: 'test' } };
    const expectedValue = { model: { value: 'updated' }, dictionary: { value: 'test' } };
    const state = createState(initialValue);

    state.addUpdate({ model: expectedValue.model });
    state.commitUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(expectedValue);
  });

  it('Doesn\'t update the state value without committing updates', () => {
    const initialValue = { model: { value: 'test' }, dictionary: { value: 'test' } };
    const state = createState(initialValue);

    state.addUpdate({ model: { value: 'updated' } });
    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });

  it('Doesn\'t update the state value if updates were rolled back', () => {
    const initialValue = { model: { value: 'test' }, dictionary: { value: 'test' } };
    const expectedValue = { model: { value: 'updated' }, dictionary: { value: 'test' } };
    const state = createState(initialValue);

    state.addUpdate({ model: expectedValue.model });
    state.rollbackUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });

  it('Updates state value only for committed updates', () => {
    const initialValue = { model: { value: 'test' }, dictionary: { value: 'test' } };
    const expectedValue = { model: { value: 'test' }, dictionary: { value: 'updated' } };
    const state = createState(initialValue);

    state.addUpdate({ model: { value: 'updated' } });
    state.rollbackUpdates();
    state.addUpdate({ dictionary: { value: 'updated' } });
    state.commitUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(expectedValue);
  });

  it('Doesn\'t update the state if changes weren\'t added', () => {
    const initialValue = { model: { value: 'test' }, dictionary: { value: 'test' } };
    const state = createState(initialValue);

    state.commitUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });
});

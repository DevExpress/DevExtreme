import { createState } from '../state';

describe('Core: Component: state', () => {
  it('Returns state value', () => {
    const initialValue = { propA: true };
    const state = createState(initialValue);

    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });

  it('Updates the state value', () => {
    const initialValue = { propA: true, propB: true };
    const expectedValue = { propA: false, propB: true };
    const state = createState(initialValue);

    state.addUpdate(() => ({ propA: false }));
    state.commitUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(expectedValue);
  });

  it('Does not update the state value without committing updates', () => {
    const initialValue = { propA: 'value ' };
    const state = createState(initialValue);

    state.addUpdate(() => ({ propA: 'updated' }));
    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });

  it('Does not update the state value if updates were rolled back', () => {
    const initialValue = { propA: true };
    const state = createState(initialValue);

    state.addUpdate(() => ({ propA: false }));
    state.rollbackUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });

  it('Updates state value only for committed updates', () => {
    const initialValue = { propA: 'value', propB: 'value' };
    const expectedValue = { propA: 'value', propB: 'updated' };
    const state = createState(initialValue);

    state.addUpdate(() => ({ propA: 'updated' }));
    state.rollbackUpdates();
    state.addUpdate(() => ({ propB: 'updated' }));
    state.commitUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(expectedValue);
  });

  it('Does not update the state if changes were not added', () => {
    const initialValue = { propA: true };
    const state = createState(initialValue);

    state.commitUpdates();
    const result = state.getCurrent();

    expect(result).toEqual(initialValue);
  });
});

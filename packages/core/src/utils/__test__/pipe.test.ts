import { pipe } from '../pipe';

describe('pipe', () => {
  it('Correctly handles one function', () => {
    const spyFunc = jest.fn();

    const pipeFunc = pipe(spyFunc);
    pipeFunc({});

    expect(spyFunc).toHaveBeenCalledTimes(1);
  });

  it('Calls all passed functions', () => {
    const spyFuncArray = [jest.fn(), jest.fn(), jest.fn()];

    const pipeFunc = pipe(...spyFuncArray);
    pipeFunc({ });

    spyFuncArray.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('Calls passed functions in correct order', () => {
    const callOrder: number[] = [];
    const spyFuncArray = [
      jest.fn().mockImplementation(() => callOrder.push(0)),
      jest.fn().mockImplementation(() => callOrder.push(1)),
      jest.fn().mockImplementation(() => callOrder.push(2)),
    ];

    const pipeFunc = pipe(...spyFuncArray);
    pipeFunc({ });

    expect(callOrder).toEqual([0, 1, 2]);
  });

  it('Passes the results of a function to the next function in the chain', () => {
    const funcImplementation = (value: number) => value + 1;
    const spyNormalizeArray = [
      jest.fn().mockImplementation(funcImplementation),
      jest.fn().mockImplementation(funcImplementation),
      jest.fn().mockImplementation(funcImplementation),
    ];

    const pipeFunc = pipe(...spyNormalizeArray);
    pipeFunc(0);

    spyNormalizeArray.forEach((spy, idx) => expect(spy).toHaveBeenCalledWith(idx));
  });
});

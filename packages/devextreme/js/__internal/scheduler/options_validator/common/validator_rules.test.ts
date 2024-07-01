import {
  mustBeDivisibleBy,
  mustBeGreaterThan,
  mustBeInRange,
  mustBeInteger,
  mustBeLessThan,
} from '@ts/scheduler/options_validator/common/validator_rules';

import * as validationFunctions from './validation_functions';

describe('mustBeInteger', () => {
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'isInteger');
  });

  afterEach(() => {
    mock?.mockReset();
  });

  it('should call isInteger function', () => {
    mustBeInteger(10);

    expect(mock).toHaveBeenCalledWith(10);
  });

  it('should return true if valid', () => {
    mock?.mockImplementation(() => true);

    const result = mustBeInteger(10);

    expect(result).toBe(true);
  });

  it('should return error (string) if invalid', () => {
    mock?.mockImplementation(() => false);

    const result = mustBeInteger(10.5);

    expect(result).toBe('10.5 must be an integer.');
  });

  it('should be the function with the correct name', () => {
    const func = mustBeInteger;

    expect(func.name).toBe('mustBeInteger');
  });
});

describe('mustBeGreaterThan', () => {
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'greaterThan');
  });

  afterEach(() => {
    mock?.mockReset();
  });

  it('should call greaterThan function', () => {
    const func = mustBeGreaterThan(10, true);
    func(15);

    expect(mock).toHaveBeenCalledWith(15, 10, true);
  });

  it('should return true if valid', () => {
    mock?.mockImplementation(() => true);

    const func = mustBeGreaterThan(10, true);
    const result = func(15);

    expect(result).toBe(true);
  });

  it('should return error (string) if invalid with strict: true', () => {
    mock?.mockImplementation(() => false);

    const func = mustBeGreaterThan(15, true);
    const result = func(10);

    expect(result).toBe('10 must be > than 15.');
  });

  it('should return error (string) if invalid with strict: false', () => {
    mock?.mockImplementation(() => false);

    const func = mustBeGreaterThan(15, false);
    const result = func(10);

    expect(result).toBe('10 must be >= than 15.');
  });

  it('should be the function with the correct name', () => {
    const func = mustBeGreaterThan(15, false);

    expect(func.name).toBe('mustBeGreaterThan');
  });
});

describe('mustBeLessThan', () => {
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'lessThan');
  });

  afterEach(() => {
    mock?.mockReset();
  });

  it('should call lessThan function', () => {
    const func = mustBeLessThan(10, true);
    func(5);

    expect(mock).toHaveBeenCalledWith(5, 10, true);
  });

  it('should return true if valid', () => {
    mock?.mockImplementation(() => true);

    const func = mustBeLessThan(10, true);
    const result = func(5);

    expect(result).toBe(true);
  });

  it('should return error (string) if invalid with strict: true', () => {
    mock?.mockImplementation(() => false);

    const func = mustBeLessThan(10, true);
    const result = func(15);

    expect(result).toBe('15 must be < than 10.');
  });

  it('should return error (string) if invalid with strict: false', () => {
    mock?.mockImplementation(() => false);

    const func = mustBeLessThan(10, false);
    const result = func(15);

    expect(result).toBe('15 must be <= than 10.');
  });

  it('should be the function with the correct name', () => {
    const func = mustBeLessThan(15, false);

    expect(func.name).toBe('mustBeLessThan');
  });
});

describe('mustBeInRange', () => {
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'inRange');
  });

  afterEach(() => {
    mock?.mockReset();
  });

  it('should call inRange function', () => {
    const func = mustBeInRange([0, 10]);
    func(5);

    expect(mock).toHaveBeenCalledWith(5, [0, 10]);
  });

  it('should return true if valid', () => {
    mock?.mockImplementation(() => true);

    const func = mustBeInRange([0, 10]);
    const result = func(5);

    expect(result).toBe(true);
  });

  it('should return error (string) if invalid ', () => {
    mock?.mockImplementation(() => false);

    const func = mustBeInRange([0, 10]);
    const result = func(15);

    expect(result).toBe('15 must be in range [0, 10].');
  });

  it('should be the function with the correct name', () => {
    const func = mustBeInRange([0, 10]);

    expect(func.name).toBe('mustBeInRange');
  });
});

describe('mustBeDivisibleBy', () => {
  let mock: jest.SpyInstance<unknown> | null = null;

  beforeEach(() => {
    mock = jest.spyOn(validationFunctions, 'divisibleBy');
  });

  afterEach(() => {
    mock?.mockReset();
  });

  it('should call divisibleBy function', () => {
    const func = mustBeDivisibleBy(10);
    func(100);

    expect(mock).toHaveBeenCalledWith(100, 10);
  });

  it('should return true if valid', () => {
    mock?.mockImplementation(() => true);

    const func = mustBeDivisibleBy(5);
    const result = func(10);

    expect(result).toBe(true);
  });

  it('should return error (string) if invalid ', () => {
    mock?.mockImplementation(() => false);

    const func = mustBeDivisibleBy(5);
    const result = func(6);

    expect(result).toBe('6 must be divisible by 5.');
  });

  it('should be the function with the correct name', () => {
    const func = mustBeDivisibleBy(5);

    expect(func.name).toBe('mustBeDivisibleBy');
  });
});

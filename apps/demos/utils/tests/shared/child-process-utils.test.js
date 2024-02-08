const childProcess = require('child_process');
const childProcessUtils = require('../../shared/child-process-utils');

jest.mock('child_process', () => ({
  execSync: jest.fn().mockImplementation((command) => {
    if (command === 'good command') return;
    throw new Error();
  }),
}));

describe('Child process utils', () => {
  test('command execution', () => {
    childProcessUtils.systemSync('good command');
    expect(childProcess.execSync).toHaveBeenCalledTimes(1);
    expect(childProcess.execSync).toHaveBeenCalledWith('good command', { stdio: 'inherit' });
  });

  test('command failing', () => {
    expect(() => childProcessUtils.systemSync('bad command')).toThrow('Error');
  });
});

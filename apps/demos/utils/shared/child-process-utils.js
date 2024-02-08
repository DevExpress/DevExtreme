const childProcess = require('child_process');

const systemSync = (command) => {
  try {
    childProcess.execSync(command, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.systemSync = systemSync;

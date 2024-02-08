const fs = require('fs');
const { join } = require('path');
const { init, updateConfig } = require('../../shared/config-helper');

const configPath = join(__dirname, '..', '..', '..', 'repository.config.json');

jest.mock('fs');

const configKeys = [
  'devextreme',
  'devextreme-angular',
  'devextreme-react',
  'devextreme-vue',
  'devexpress-diagram',
  'devexpress-gantt',
  'devextreme-aspnet',
];

describe('Config helper tests', () => {
  beforeEach(() => {
    fs.existsSync.mockReset();
    fs.readFileSync.mockReset();
    fs.writeFileSync.mockReset();
  });
  test('Config does not exists', () => {
    fs.existsSync.mockReturnValue(false);
    const config = init();

    configKeys.forEach((key) => {
      expect(config[key]).toBe('');
    });

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(configPath, `{
  "devextreme": "",
  "devextreme-angular": "",
  "devextreme-react": "",
  "devextreme-vue": "",
  "devexpress-diagram": "",
  "devexpress-gantt": "",
  "devextreme-aspnet": ""
}`, 'utf8');
  });

  test('Has config file', () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(`{"devextreme":"1",
        "devextreme-angular":"1",
        "devextreme-react":"1",
        "devextreme-vue":"1",
        "devexpress-diagram":"1",
        "devexpress-gantt":"1",
        "devextreme-aspnet":"1"}`);
    const config = init();

    configKeys.forEach((key) => {
      expect(config[key]).toBe('1');
    });

    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(fs.readFileSync).toHaveBeenCalledWith(configPath, 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
  });

  test('Update config', () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(`{"devextreme":"1",
        "devextreme-angular":"1",
        "devextreme-react":"1",
        "devextreme-vue":"1",
        "devexpress-diagram":"1",
        "devexpress-gantt":"1",
        "devextreme-aspnet":"1"}`);
    const config = init();

    config['devextreme-aspnet'] = '2';

    updateConfig(config);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(configPath, `{
  "devextreme": "1",
  "devextreme-angular": "1",
  "devextreme-react": "1",
  "devextreme-vue": "1",
  "devexpress-diagram": "1",
  "devexpress-gantt": "1",
  "devextreme-aspnet": "2"
}`, 'utf8');
  });
});

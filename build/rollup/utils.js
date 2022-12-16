export const FORMAT_EXTENSIONS = {
  esm: 'mjs',
  cjs: 'cjs',
}

export function checkExternalPackage(id) {
  return ['@devextreme'].includes(id.split('/')[0]);
}

export function checkWatchMode() {
  return process.argv.indexOf('--watch') === -1;
}

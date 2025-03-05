import * as VueType from 'vue';

export function getVueVersion() {
  const currentVersion = VueType.version;
  return currentVersion ? Number(currentVersion.split('.')[0]) : 2;
}

export function isVue3() {
  return getVueVersion() === 3;
}

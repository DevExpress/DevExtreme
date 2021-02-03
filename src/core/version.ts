import * as VueType from "vue";
const Vue = (VueType as any).default || VueType;

export function getVueVersion() {
    const currentVersion = (Vue as any).version;
    return Number(currentVersion.split(".")[0]);
}

export function isVue3() {
    return getVueVersion() === 3;
}

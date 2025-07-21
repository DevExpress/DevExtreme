const deps = (await (await fetch('../../../../package.json')).json()).dependencies;
const trimVersion = (versionNmb, needTrim) => needTrim ? versionNmb.replace(/\.\d+\.\d+/,'') : versionNmb;

export function getDepWithVersion(dep, needTrim = true) {
    return `${dep}@` + trimVersion(deps[dep].replace(/^\D/,''), needTrim);
}
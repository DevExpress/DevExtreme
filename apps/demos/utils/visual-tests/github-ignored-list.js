import menuMeta from '../../menuMeta.json';

const gridMeta = menuMeta[0].Groups;

export const gitHubIgnored = gridMeta.reduce((result, Group) => {
  if (Group.Demos) {
    Group.Demos.forEach(demo => {
      if (!!demo.NoPreloaded) {
        result.push(demo.Name);
      }
    });
  }
  return result
}, []).sort()

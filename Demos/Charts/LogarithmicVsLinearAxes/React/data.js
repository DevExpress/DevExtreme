export const dataSource = [];

for (let i = 0; i < 600; i += 1) {
  const argument = i / 100;
  dataSource.push({ arg: argument, val:  Math.exp(-argument) * Math.cos(2 * Math.PI * argument) });
}


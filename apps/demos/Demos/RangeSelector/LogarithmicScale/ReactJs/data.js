const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    arg: 10 ** i * 0.1,
    val: Math.log(i + 1) / Math.log(0.5) + (Math.random() - 0.5) * (100 / (i + 1)) + 10,
  });
}
export const dataSource = data;

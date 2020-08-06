const asyncForEach = async (
  array: any[],
  callback: (elem: any, index: any, array: any) => Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
};

export default asyncForEach;

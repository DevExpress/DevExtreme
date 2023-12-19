export type Options<TComponentOptions = unknown> = {
  [TProperty in keyof TComponentOptions]: TComponentOptions[TProperty][]
};

export const generateOptionMatrix = (
  options: Options,
  index = 0,
  prevConfigurations: Options[] = [],
): Options[] => {
  const keys = Object.keys(options);

  if (index === keys.length) {
    return [Object.assign({}, ...prevConfigurations)];
  }

  const key = keys[index];
  const values = options[key];

  let configurations: Options[] = [];

  values.forEach((value) => {
    const currentConfigurations = [
      ...prevConfigurations,
      { [key]: value },
    ];

    const generatedConfigurations = generateOptionMatrix(
      options,
      index + 1,
      currentConfigurations,
    );

    configurations = configurations.concat(generatedConfigurations);
  });

  return configurations;
};

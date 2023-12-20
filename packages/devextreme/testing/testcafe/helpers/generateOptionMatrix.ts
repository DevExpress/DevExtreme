export type Options<TComponentOptions = unknown> = {
  [TProperty in keyof TComponentOptions]: TComponentOptions[TProperty][]
};

export const generateOptionMatrix = (
  options: Options,
  index = 0,
  currentConfigurations: Options[] = [],
): Options[] => {
  const keys = Object.keys(options);

  if (index === keys.length) {
    return [Object.assign({}, ...currentConfigurations)];
  }

  const key = keys[index];
  const values = options[key];

  const configurations: Options[] = [];

  values.forEach((value) => {
    currentConfigurations.push({ [key]: value });

    const generatedConfigurations = generateOptionMatrix(
      options,
      index + 1,
      currentConfigurations,
    );

    configurations.push(...generatedConfigurations);

    currentConfigurations.pop();
  });

  return configurations;
};

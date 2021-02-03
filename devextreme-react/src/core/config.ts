interface IOptions {
  useLegacyTemplateEngine: boolean;
}

let config: IOptions = {
  useLegacyTemplateEngine: false,
};

function setOptions(options: Partial<IOptions>): void {
  config = { ...config, ...options };
}

function getOption<TName extends keyof IOptions>(optionName: TName): IOptions[TName] {
  return config[optionName];
}

export default setOptions;
export { getOption };

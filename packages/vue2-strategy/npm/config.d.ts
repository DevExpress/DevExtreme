interface IOptions {
    useLegacyTemplateEngine: boolean;
}
declare function setOptions(options: Partial<IOptions>): void;
declare function getOption<TName extends keyof IOptions>(optionName: TName): IOptions[TName];
export default setOptions;
export { getOption };

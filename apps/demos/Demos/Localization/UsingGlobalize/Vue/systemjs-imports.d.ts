declare module 'npm:devextreme/localization/messages/de.json!json' {
  const json: object;
  export default json;
}

declare module 'npm:devextreme/localization/messages/ru.json!json' {
  const json: object;
  export default json;
}

declare module 'npm:devextreme-cldr-data/de.json!json' {
  const json: object;
  export default json;
}

declare module 'npm:devextreme-cldr-data/ru.json!json' {
  const json: object;
  export default json;
}

declare module 'npm:devextreme-cldr-data/supplemental.json!json' {
  const json: object;
  export default json;
}

declare module 'globalize' {
  const Globalize: {
    load: (...args: object[]) => void;
    loadMessages: (messages: object) => void;
    locale: (locale: string) => void;
    formatMessage: (key: string, ...args: unknown[]) => string;
  };
  export default Globalize;
}

/* eslint-disable no-control-regex */
/* eslint-disable no-useless-escape */
import { template, templateSettings } from 'dot';

const defaultSettings = {
  ...templateSettings,
  conditional: /\<#\?(\?)?\s*([\s\S]*?)\s*#\>/g,
  define: /\<###\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)##\>/g,
  encode: /\<#!([\s\S]+?)#\>/g,
  evaluate: /\<#([\s\S]+?)#\>/g,
  interpolate: /\<#=([\s\S]+?)#\>/g,
  iterate: /\<#~\s*(?:#\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*#\>)/g,
  use: /\<##([\s\S]+?)#\>/g,
  strip: false,
  varname: 'it',
};

const createTemplate = (templateStr: string): ((model: any) => string) => {
  const templateFunc = template(templateStr, defaultSettings);

  return (model: any) => (templateFunc(model) as string)
    .replace(/[\s\S]{1}\x08{1}|[\s\S]{2}\x08{2}|[\s\S]{3}\x08{3}/g, '')
    .replace(/\x08/, '');
};

function tab(i: number): string {
  return Array(i * 2 + 1).join(' ');
}

const L1 = `\n${tab(1)}`;
const L2 = `\n${tab(2)}`;
const L3 = `\n${tab(3)}`;
const L4 = `\n${tab(4)}`;

const TAB1: string = tab(1);
const TAB2: string = tab(2);
const TAB3: string = tab(3);
const TAB4: string = tab(4);

export {
  createTemplate,
  L1,
  L2,
  L3,
  L4,
  TAB1,
  TAB2,
  TAB3,
  TAB4,
};

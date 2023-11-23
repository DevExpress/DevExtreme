export { xorTransform } from '../../__internal/core/license/byte_utils';

export function encodeHtml(str: string): string;

export function splitQuad(raw: any): any;

export function quadToObject(raw: any): Record<'top' | 'left' | 'right' | 'bottom', number>;

export function format(template: string, ...values: any[]): string;

export function replaceAll(text: string, searchToken: string, replacementToken: string): string;

export function isEmpty(text: string): boolean;

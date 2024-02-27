import React from 'react';
import { Decorator } from '@storybook/react';

export const themesToolbarItems = [
    { title: 'Generic Light', value: 'light' },
    { title: 'Generic Darkviolet', value: 'darkviolet' },
    { title: 'Material Lime Light', value: 'material.lime.light' },
    { title: 'Material Orange Dark', value: 'material.orange.dark' },
    { title: 'Fluent Blue Light', value: 'fluent.blue.light' },
    { title: 'Fluent Saas Dark', value: 'fluent.saas.dark' },
]

export const ThemeDecorator: Decorator = (Story, ctx) => {
    const themeName = ctx.globals.theme.split('.').length < 3 ? 'generic' : ctx.globals.theme.split('.')[0];
    return (
        <div className={`dx-theme-${themeName}-typography`} style={{ padding: '20px', borderRadius: 6 }}>
            <link rel="stylesheet" href={`css/dx.${ctx.globals.theme}.css`} />
            <Story />
        </div>
    );
}

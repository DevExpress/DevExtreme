import React from 'react';
import { Decorator } from '@storybook/react';
import './styles.css';

export const themeToolbarItems = [
    { title: 'Generic Light', value: 'light' },
    { title: 'Generic Dark', value: 'dark' },
    { title: 'Generic Carmine', value: 'carmine' },
    { title: 'Generic Soft Blue', value: 'softblue' },
    { title: 'Generic Dark Moon', value: 'darkmoon' },
    { title: 'Generic Dark Violet', value: 'darkviolet' },
    { title: 'Generic Green Mist', value: 'greenmist' },
    { title: 'Generic Contrast', value: 'contrast' },
    { title: 'Material Blue Light', value: 'material.blue.light' },
    { title: 'Material Blue Dark', value: 'material.blue.dark' },
    { title: 'Material Lime Light', value: 'material.lime.light' },
    { title: 'Material Lime Dark', value: 'material.lime.dark' },
    { title: 'Material Orange Light', value: 'material.orange.light' },
    { title: 'Material Orange Dark', value: 'material.orange.dark' },
    { title: 'Material Purple Light', value: 'material.purple.light' },
    { title: 'Material Purple Dark', value: 'material.purple.dark' },
    { title: 'Material Teal Light', value: 'material.teal.light' },
    { title: 'Material Teal Dark', value: 'material.teal.dark' },
    { title: 'Fluent Blue Light', value: 'fluent.blue.light' },
    { title: 'Fluent Blue Dark', value: 'fluent.blue.dark' },
    { title: 'Fluent Saas Light', value: 'fluent.saas.light' },
    { title: 'Fluent Saas Dark', value: 'fluent.saas.dark' },
];

export const compact = [
    { title: 'Non Compact', value: false },
    { title: 'Compact', value: true }
]

export const ThemeDecorator: Decorator = (Story, ctx) => {
    const { theme, compact } = ctx.globals;
    const themeName = theme.split('.').length < 3 ? 'generic' : theme.split('.')[0];
    const cssFileHref = `css/dx.${theme}${compact ? '.compact' : ''}.css`
    return (
        <div className={`dx-theme-${themeName}-typography storybook-theme-decorator`}>
            <link rel="stylesheet" href={cssFileHref} />
            <Story />
        </div>
    );
}

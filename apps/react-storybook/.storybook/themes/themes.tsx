import React from 'react';
import { Decorator } from '@storybook/react-webpack5';
import './styles.css';

interface Theme {
    title: string;
    value: string;
    family: 'generic' | 'material' | 'fluent' | 'fluent-next';
    cssName: string;
}

const themes: Theme[] = [
    { title: 'Generic Light', value: 'light', family: 'generic', cssName: 'light' },
    { title: 'Generic Dark', value: 'dark', family: 'generic', cssName: 'dark' },
    { title: 'Generic Carmine', value: 'carmine', family: 'generic', cssName: 'carmine' },
    { title: 'Generic Soft Blue', value: 'softblue', family: 'generic', cssName: 'softblue' },
    { title: 'Generic Dark Moon', value: 'darkmoon', family: 'generic', cssName: 'darkmoon' },
    { title: 'Generic Dark Violet', value: 'darkviolet', family: 'generic', cssName: 'darkviolet' },
    { title: 'Generic Green Mist', value: 'greenmist', family: 'generic', cssName: 'greenmist' },
    { title: 'Generic Contrast', value: 'contrast', family: 'generic', cssName: 'contrast' },
    { title: 'Material Blue Light', value: 'material-blue-light', family: 'material', cssName: 'material.blue.light' },
    { title: 'Material Blue Dark', value: 'material-blue-dark', family: 'material', cssName: 'material.blue.dark' },
    { title: 'Material Lime Light', value: 'material-lime-light', family: 'material', cssName: 'material.lime.light' },
    { title: 'Material Lime Dark', value: 'material-lime-dark', family: 'material', cssName: 'material.lime.dark' },
    { title: 'Material Orange Light', value: 'material-orange-light', family: 'material', cssName: 'material.orange.light' },
    { title: 'Material Orange Dark', value: 'material-orange-dark', family: 'material', cssName: 'material.orange.dark' },
    { title: 'Material Purple Light', value: 'material-purple-light', family: 'material', cssName: 'material.purple.light' },
    { title: 'Material Purple Dark', value: 'material-purple-dark', family: 'material', cssName: 'material.purple.dark' },
    { title: 'Material Teal Light', value: 'material-teal-light', family: 'material', cssName: 'material.teal.light' },
    { title: 'Material Teal Dark', value: 'material-teal-dark', family: 'material', cssName: 'material.teal.dark' },
    { title: 'Fluent Blue Light', value: 'fluent-blue-light', family: 'fluent', cssName: 'fluent.blue.light' },
    { title: 'Fluent Blue Dark', value: 'fluent-blue-dark', family: 'fluent', cssName: 'fluent.blue.dark' },
    { title: 'Fluent Saas Light', value: 'fluent-saas-light', family: 'fluent', cssName: 'fluent.saas.light' },
    { title: 'Fluent Saas Dark', value: 'fluent-saas-dark', family: 'fluent', cssName: 'fluent.saas.dark' },
    { title: 'Fluent Next Blue Light', value: 'fluent-next-blue-light', family: 'fluent-next', cssName: 'fluent-next.blue.light' },
    { title: 'Fluent Next Blue Dark', value: 'fluent-next-blue-dark', family: 'fluent-next', cssName: 'fluent-next.blue.dark' },
];

export const themeToolbarItems = themes.map(({ title, value }) => ({ title, value }));

export const compact = [
    { title: 'Non Compact', value: false },
    { title: 'Compact', value: true }
]

export const ThemeDecorator: Decorator = (Story, ctx) => {
    const { theme: rawTheme, compact } = ctx.globals;
    const theme = themes.find(({ value }) => value === rawTheme) ?? themes[0];

    const [prevTheme, setPrevTheme] = React.useState<string | null>(null);
    const [prevCompact, setPrevCompact] = React.useState<boolean | null>(null);
    const [cssLoaded, setCssLoaded] = React.useState(false);

    React.useEffect(() => {
        if (prevTheme !== null && prevCompact !== null) {
            if (prevTheme !== rawTheme || prevCompact !== compact) {
                window.location.reload();
            }
        }

        setPrevTheme(rawTheme);
        setPrevCompact(compact);
    }, [rawTheme, compact]);

    const cssFileHref = `css/dx.${theme.cssName}${compact ? '.compact' : ''}.css`;

    return (
        <div key={cssFileHref} className={`dx-theme-${theme.family}-typography storybook-theme-decorator`}>
            <link
                rel="stylesheet"
                href={cssFileHref}
                onLoad={() => setCssLoaded(true)}
                onError={() => setCssLoaded(true)}
            />
            {cssLoaded && <Story />}
        </div>
    );
}

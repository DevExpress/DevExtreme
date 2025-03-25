import type { IItemProps } from 'devextreme-react/stepper'

export const defaultItems: IItemProps[] = [{}, {}, {}, {}, {}];

export const itemsWithTitle: IItemProps[] = [
    {
        title: 'Cart',
    },
    {
        title: 'Shipping Info',
    },
    {
        title: 'Promo Code',
        optional: true,
    },
    {
        title: 'Checkout ',
    },
    {
        title: 'Ordered',
    },
];

export const itemsWithIconAndTitle: IItemProps[] = [
    {
        icon: 'cart',
        title: 'Cart',
    },
    {
        icon: 'clipboardtasklist',
        title: 'Shipping Info',
    },
    {
        icon: 'gift',
        title: 'Promo Code',
        optional: true,
    },
    {
        icon: 'packagebox',
        title: 'Checkout ',
    },
    {
        icon: 'checkmarkcircle',
        title: 'Ordered',
    },
];

export const itemsWithIcon: IItemProps[] = [
    {
        icon: 'cart',
    },
    {
        icon: 'clipboardtasklist',
    },
    {
        icon: 'gift',
        optional: true,
    },
    {
        icon: 'packagebox',
    },
    {
        icon: 'checkmarkcircle',
    },
];
import { Injectable } from '@angular/core';

export class Tab {
  id: number;

  text?: string;

  icon?: string;
}

const tabsWithText: Tab[] = [
  {
    id: 0,
    text: 'User',
  },
  {
    id: 1,
    text: 'Analytics',
  },
  {
    id: 2,
    text: 'Clients',
  },
  {
    id: 3,
    text: 'Orders',
  },
  {
    id: 4,
    text: 'Favorites',
  },
  {
    id: 5,
    text: 'Search',
  },
];

const tabsWithIcon: Tab[] = [
  {
    id: 0,
    icon: 'user',
  },
  {
    id: 1,
    icon: 'chart',
  },
  {
    id: 2,
    icon: 'accountbox',
  },
  {
    id: 3,
    icon: 'ordersbox',
  },
  {
    id: 4,
    icon: 'bookmark',
  },
  {
    id: 5,
    icon: 'search',
  },
];

const tabsWithIconAndText: Tab[] = [
  {
    id: 0,
    text: 'User',
    icon: 'user',
  },
  {
    id: 1,
    text: 'Analytics',
    icon: 'chart',
  },
  {
    id: 2,
    text: 'Clients',
    icon: 'accountbox',
  },
  {
    id: 3,
    text: 'Orders',
    icon: 'ordersbox',
  },
  {
    id: 4,
    text: 'Favorites',
    icon: 'bookmark',
  },
  {
    id: 5,
    text: 'Search',
    icon: 'search',
  },
];

@Injectable()
export class Service {
  getTabsWithText(): Tab[] {
    return tabsWithText;
  }

  getTabsWithIconAndText(): Tab[] {
    return tabsWithIconAndText;
  }

  getTabsWithIcon(): Tab[] {
    return tabsWithIcon;
  }
}

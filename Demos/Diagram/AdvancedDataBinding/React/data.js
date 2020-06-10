var orgItems = [
  {
    'id': '106',
    'name': 'Development',
    'type': 'group'
  },
  {
    'id': '107',
    'name': 'WinForms\nTeam',
    'type': 'group'
  },
  {
    'id': '108',
    'name': 'WPF\nTeam',
    'type': 'group'
  },
  {
    'id': '109',
    'name': 'Javascript\nTeam',
    'type': 'group'
  },
  {
    'id': '110',
    'name': 'ASP.NET\nTeam',
    'type': 'group'
  },
  {
    'id': '112',
    'name': 'Ana\nTrujillo',
    'level': 'senior'
  },
  {
    'id': '113',
    'name': 'Antonio\nMoreno'
  },
  {
    'id': '115',
    'name': 'Christina\nBerglund'
  },
  {
    'id': '116',
    'name': 'Hanna\nMoos'
  },
  {
    'id': '119',
    'name': 'Laurence\nLebihan'
  },
  {
    'id': '120',
    'name': 'Elizabeth\nLincoln',
    'level': 'senior'
  },
  {
    'id': '122',
    'name': 'Patricio\nSimpson',
    'level': 'senior'
  },
  {
    'id': '123',
    'name': 'Francisco\nChang'
  }
];

var orgLinks = [
  {
    'id': '124',
    'from': '106',
    'to': '108',
  },
  {
    'id': '125',
    'from': '106',
    'to': '109',
  },
  {
    'id': '126',
    'from': '106',
    'to': '107',
  },
  {
    'id': '127',
    'from': '106',
    'to': '110',
  },
  {
    'id': '129',
    'from': '110',
    'to': '112',
  },
  {
    'id': '130',
    'from': '110',
    'to': '113',
  },
  {
    'id': '132',
    'from': '107',
    'to': '115',
  },
  {
    'id': '133',
    'from': '107',
    'to': '116',
  },
  {
    'id': '136',
    'from': '108',
    'to': '119',
  },
  {
    'id': '137',
    'from': '108',
    'to': '120',
  },
  {
    'id': '139',
    'from': '109',
    'to': '122',
  },
  {
    'id': '140',
    'from': '109',
    'to': '123',
  }
];

export default {
  getOrgItems() {
    return orgItems;
  },
  getOrgLinks() {
    return orgLinks;
  }
};

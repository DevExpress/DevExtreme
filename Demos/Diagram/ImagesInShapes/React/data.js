var orgItems = [
  {
    'id': '106',
    'text': 'Development',
    'type': 'ellipse'
  },
  {
    'id': '107',
    'text': 'WinForms\nTeam',
    'type': 'ellipse'
  },
  {
    'id': '108',
    'text': 'WPF\nTeam',
    'type': 'ellipse'
  },
  {
    'id': '109',
    'text': 'Javascript\nTeam',
    'type': 'ellipse'
  },
  {
    'id': '110',
    'text': 'ASP.NET\nTeam',
    'type': 'ellipse'
  },
  {
    'id': '112',
    'text': 'Ken Samuelson',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/32.png'
  },
  {
    'id': '113',
    'text': 'Terry Bradley',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/33.png'
  },
  {
    'id': '115',
    'text': 'Nat Maguiree',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/34.png'
  },
  {
    'id': '116',
    'text': 'Gabe Jones',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/35.png'
  },
  {
    'id': '117',
    'text': 'Lucy Ball',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/36.png'
  },
  {
    'id': '119',
    'text': 'Bart Arnaz',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/37.png'
  },
  {
    'id': '120',
    'text': 'Leah Simpson',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/38.png'
  },
  {
    'id': '122',
    'text': 'Hannah Brookly',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/39.png'
  },
  {
    'id': '123',
    'text': 'Arnie Schwartz',
    'type': 'cardWithImageOnLeft',
    'picture': '../../../../images/employees/40.png'
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
    'id': '134',
    'from': '107',
    'to': '117',
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

export default function GroupCaption(iconName) {
  return function template(data) {
    return `<i class='dx-icon dx-icon-${iconName}'></i><span>${data.caption}</span>`;
  };
}

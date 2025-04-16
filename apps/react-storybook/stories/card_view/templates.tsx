import Button from "devextreme/ui/button"

export function renderFooter() {
  const container = document.createElement('div');
  const button1 = document.createElement('div');
  const button2 = document.createElement('div');

  container.append(button1, button2);

  new Button(button1, {text: 'button 1'});
  new Button(button2, {text: 'button 2'});

  return container;
}
$(() => {
  $('#gauge').dxCircularGauge({
    scale: {
      startValue: 0,
      endValue: 10,
      tickInterval: 1,
      minorTick: { visible: true },
    },
    export: {
      enabled: true,
    },
    rangeContainer: {
      backgroundColor: '#03a9f4',
    },
    valueIndicator: {
      color: '#03a9f4',
    },
    value: 7.78,
    title: {
      text: 'Amount of Produced Gold (Kilos)',
      verticalAlignment: 'bottom',
      font: {
        size: 25,
      },
      margin: {
        top: 25,
      },
    },
    centerTemplate: (gauge, container) => {
      const topGroup = createGroup(50, 0);
      const bottomGroup = createGroup(43, 140);
      const tspan1 = createTSpan(57, 0, 'Capacity: 10kg');
      const tspan2 = createTSpan(57, 20, 'Graduation: 10g');

      const baseRect = createRect(200, 200, 'transparent', 0);
      const topRect = createRect(100, 50, '#f2f2f2', 25);
      const bottomRect = createRect(114, 56, '#fff', 8);
      const valueText = createText(50, 25, 20, gauge.value());
      const bottomText = createText(57, 23, 12, '');

      bottomRect.setAttribute('class', 'description');

      bottomText.appendChild(tspan1);
      bottomText.appendChild(tspan2);

      topGroup.appendChild(topRect);
      topGroup.appendChild(valueText);

      bottomGroup.appendChild(bottomRect);
      bottomGroup.appendChild(bottomText);

      container.appendChild(baseRect);
      container.appendChild(topGroup);
      container.appendChild(bottomGroup);
    },
  });
});

function createRect(width, height, fill, radius) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  rect.setAttribute('x', 0);
  rect.setAttribute('y', 0);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  rect.setAttribute('fill', fill);
  rect.setAttribute('rx', radius);

  return rect;
}

function createText(x, y, fontSize, content) {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('fill', '#000');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', fontSize);
  text.setAttribute('alignment-baseline', 'middle');
  text.textContent = content;

  return text;
}

function createGroup(x, y) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  group.setAttribute('transform', `translate(${x} ${y})`);

  return group;
}

function createTSpan(x, dy, content) {
  const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

  tspan.setAttribute('x', x);
  tspan.setAttribute('dy', dy);
  tspan.textContent = content;

  return tspan;
}

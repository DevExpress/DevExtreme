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
      text: 'Gold Production (in Kilograms)',
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

      const baseRect = createRect(200, 200, 'transparent', 0);
      const topRect = createRect(100, 70, '#f2f2f2', 8);
      const bottomRect = createRect(114, 56, '#fff', 8);
      const valueText = createText(50, 27, 20, 'middle', 30, gauge.value(), 'kg');
      const bottomText = createText(15, 23, 12, 'start', 20, 'Capacity: 10 kg', 'Graduation: 10 g');

      bottomRect.setAttribute('class', 'description');

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

function createText(x, y, fontSize, textAnchor, dy, content1, content2) {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('fill', '#000');
  text.setAttribute('text-anchor', textAnchor);
  text.setAttribute('font-size', fontSize);

  const tspan1 = createTSpan(x, 0, content1);
  const tspan2 = createTSpan(x, dy, content2);

  text.appendChild(tspan1);
  text.appendChild(tspan2);

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

window.onload = function () {
  const color = '#f05b41';
  const speedValue = ko.observable(40);
  const gaugeValue = ko.computed(() => (speedValue() / 2));

  const viewModel = {
    speedValue,
    speedOptions: {
      geometry: {
        startAngle: 225,
        endAngle: 315,
      },
      scale: {
        startValue: 20,
        endValue: 200,
        tickInterval: 20,
        minorTickInterval: 10,
      },
      centerTemplate(gauge, container) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        circle.setAttribute('cx', 100);
        circle.setAttribute('cy', 100);
        circle.setAttribute('r', 55);
        circle.setAttribute('stroke-width', 2);
        circle.setAttribute('stroke', color);
        circle.setAttribute('fill', 'transparent');

        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'middle');
        text.setAttribute('x', 100);
        text.setAttribute('y', 100);
        text.setAttribute('font-size', 50);
        text.setAttribute('font-weight', 'lighter');
        text.setAttribute('fill', color);
        text.textContent = gauge.value();

        container.appendChild(circle);
        container.appendChild(text);
      },
      valueIndicator: {
        indentFromCenter: 55,
        color,
        spindleSize: 0,
        spindleGapSize: 0,
      },
      value: speedValue,
      size: {
        width: 260,
      },
    },
    coolantOptions: {
      geometry: {
        startAngle: 180,
        endAngle: 90,
      },
      scale: {
        startValue: 0,
        endValue: 100,
        tickInterval: 10,
      },
      valueIndicator: {
        color,
      },
      value: gaugeValue,
      size: {
        width: 90,
        height: 90,
      },
    },
    psiOptions: {
      scale: {
        startValue: 100,
        endValue: 0,
        tickInterval: 10,
      },
      geometry: {
        startAngle: 90,
        endAngle: 0,
      },
      valueIndicator: {
        color,
      },
      value: gaugeValue,
      size: {
        width: 90,
        height: 90,
      },
    },
    rpmOptions: {
      scale: {
        startValue: 100,
        endValue: 0,
        tickInterval: 10,
      },
      geometry: {
        startAngle: -90,
        endAngle: -180,
      },
      valueIndicator: {
        color,
      },
      value: gaugeValue,
      size: {
        width: 90,
        height: 90,
      },
    },
    instantFuelOptions: {
      scale: {
        startValue: 0,
        endValue: 100,
        tickInterval: 10,
      },
      geometry: {
        startAngle: 0,
        endAngle: -90,
      },
      valueIndicator: {
        color,
      },
      value: gaugeValue,
      size: {
        width: 90,
        height: 90,
      },
    },
    fuelOptions: {
      scale: {
        startValue: 0,
        endValue: 50,
        tickInterval: 25,
        minorTickInterval: 12.5,
        minorTick: {
          visible: true,
        },
        label: {
          visible: false,
        },
      },
      valueIndicator: {
        color,
        size: 8,
        offset: 7,
      },
      value: ko.computed(() => (50 - speedValue() * 0.24)),
      size: {
        width: 90,
        height: 20,
      },
    },
    sliderOptions: {
      min: 0,
      max: 200,
      value: speedValue,
      width: 155,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('gauge-demo'));
};

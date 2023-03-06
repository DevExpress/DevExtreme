const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const color = '#f05b41';
  $scope.speedValue = 40;
  $scope.gaugeValue = 20;
  $scope.linearGaugeValue = 42.8;

  $scope.$watch('speedValue', (speedValue) => {
    $scope.gaugeValue = speedValue / 2;
  });

  $scope.$watch('speedValue', (speedValue) => {
    $scope.linearGaugeValue = 50 - speedValue * 0.24;
  });

  $scope.options = {
    speed: {
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
      valueIndicator: {
        indentFromCenter: 55,
        color,
        spindleSize: 0,
        spindleGapSize: 0,
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
      bindingOptions: {
        value: 'speedValue',
      },
      size: {
        width: 260,
      },
    },
    coolant: {
      geometry: {
        startAngle: 180,
        endAngle: 90,
      },
      scale: {
        startValue: 0,
        endValue: 100,
        tickInterval: 50,
      },
      valueIndicator: {
        color,
      },
      bindingOptions: {
        value: 'gaugeValue',
      },
      size: {
        width: 90,
        height: 90,
      },
    },
    psi: {
      scale: {
        startValue: 100,
        endValue: 0,
        tickInterval: 50,
      },
      geometry: {
        startAngle: 90,
        endAngle: 0,
      },
      valueIndicator: {
        color,
      },
      bindingOptions: {
        value: 'gaugeValue',
      },
      size: {
        width: 90,
        height: 90,
      },
    },
    rpm: {
      scale: {
        startValue: 100,
        endValue: 0,
        tickInterval: 50,
      },
      geometry: {
        startAngle: -90,
        endAngle: -180,
      },
      valueIndicator: {
        color,
      },
      bindingOptions: {
        value: 'gaugeValue',
      },
      size: {
        width: 90,
        height: 90,
      },
    },
    instantFuel: {
      scale: {
        startValue: 0,
        endValue: 100,
        tickInterval: 50,
      },
      geometry: {
        startAngle: 0,
        endAngle: -90,
      },
      valueIndicator: {
        color,
      },
      bindingOptions: {
        value: 'gaugeValue',
      },
      size: {
        width: 90,
        height: 90,
      },
    },
    fuel: {
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
      bindingOptions: {
        value: 'linearGaugeValue',
      },
      size: {
        width: 90,
        height: 20,
      },
    },
    slider: {
      min: 0,
      max: 200,
      bindingOptions: {
        value: 'speedValue',
      },
      width: 155,
    },
  };
});

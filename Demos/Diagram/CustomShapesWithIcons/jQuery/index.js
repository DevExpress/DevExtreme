$(function() {
    var diagram = $("#diagram").dxDiagram({
        customShapes: [
            {
                category: "hardware",
                type: "internet",
                title: "Internet",
                backgroundImageUrl: "../../../../images/shapes/internet.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Internet",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "laptop",
                title: "Laptop",
                backgroundImageUrl: "../../../../images/shapes/laptop.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Laptop",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "mobile",
                title: "Mobile",
                backgroundImageUrl: "../../../../images/shapes/mobile.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Mobile",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "pc",
                title: "PC",
                backgroundImageUrl: "../../../../images/shapes/pc.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "PC",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "phone",
                title: "Phone",
                backgroundImageUrl: "../../../../images/shapes/phone.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Phone",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "printer",
                title: "Printer",
                backgroundImageUrl: "../../../../images/shapes/printer.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Printer",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "router",
                title: "Router",
                backgroundImageUrl: "../../../../images/shapes/router.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Router",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
            },
            {
                category: "hardware",
                type: "scaner",
                title: "Scaner",
                backgroundImageUrl: "../../../../images/shapes/scaner.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Scaner",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "server",
                title: "Server",
                backgroundImageUrl: "../../../../images/shapes/server.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Server",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "switch",
                title: "Switch",
                backgroundImageUrl: "../../../../images/shapes/switch.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Switch",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            },
            {
                category: "hardware",
                type: "wifi",
                title: "Wi Fi Router",
                backgroundImageUrl: "../../../../images/shapes/wifi.svg",
                backgroundImageLeft: 0.15,
                backgroundImageTop: 0,
                backgroundImageWidth: 0.7,
                backgroundImageHeight: 0.7,
                defaultWidth: 0.75,
                defaultHeight: 0.75,
                defaultText: "Wi Fi",
                allowEditText: true,
                textLeft: 0,
                textTop: 0.7,
                textWidth: 1,
                textHeight: 0.3,
                connectionPoints: [
                    { x: 0.5, y: 0 },
                    { x: 0.9, y: 0.5 },
                    { x: 0.5, y: 1 },
                    { x: 0.1, y: 0.5 }
                ]
            }
        ],
        toolbox: {
            groups: [{ category: "hardware", title: "Hardware" }]
        }
    }).dxDiagram("instance");

    $.ajax({
        url: "../../../../data/diagram-hardware.json",
        dataType: "text",
        success: function(data) {
            diagram.import(data);
        }
    });
});

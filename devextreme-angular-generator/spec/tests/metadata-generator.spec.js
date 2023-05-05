"use strict";
describe("metadata-generator", function() {
    var extend = require('util')._extend;
    var path = require('path');
    var Generator = require('../../dist/metadata-generator').default;

    const TYPES_SEPORATOR = ' | ';

    var testConfig = {
        sourceMetadataFilePath: "source-path",
        deprecatedMetadataFilePath: "deprecated-path",
        outputFolderPath: "output-path",
        nestedPathPart: 'nested',
        basePathPart: 'base',
        widgetPackageName: "widgetPackageName",
        wrapperPackageName: 'wrapperPackageName'
    };

    var store,
        generator,
        metas;

    var setupContext = function(metadata, deprecatedData) {
        store = {
            read: jasmine.createSpy().and.callFake(function(filePath) {
                if(filePath === "source-path") {
                    return metadata;
                } else if(filePath === "deprecated-path") {
                    return deprecatedData || {};
                }
            }),
            write: jasmine.createSpy()
        };
        generator = new Generator(store);
        generator.generate(testConfig);
        metas = {};
        store.write.calls.allArgs().forEach(function(args) {
            var metaData = args[1];
            metas[metaData.className] = metaData;
        });
    };

    describe("simple components", function() {

        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxTestWidget: {
                        Options: {
                            onTestEvent: {
                                DocID: 'Widget.Options.onTestEvent',
                                IsEvent: true,
                                IsDeprecated: true,
                            },
                            testTemplate: {
                                DocID: 'Widget.Options.testTemplate',
                                IsTemplate: true,
                            },
                            testProperty: {
                                DocID: 'Widget.Options.testProperty'
                            }
                        },
                        DocID: 'dxTestWidget',
                        Module: 'test_widget',
                        OptionsTypeParams: ['T1', 'T2'],
                    },
                    dxEditorWidget: {
                        Options: {
                            onValueChanged: {
                                DocID: 'Widget.Options.onValueChanged',
                            }
                        },
                        DocID: 'dxEditorWidget',
                        Module: 'test_widget'
                    },
                    dxCollectionWidget: {
                        Options: {
                            collectionProperty: {
                                DocID: 'Widget.Options.collectionProperty',
                                IsCollection: true
                            },
                            dataSourceProperty: {
                                DocID: 'Widget.Options.dataSourceProperty',
                                IsDataSource: true
                            }
                        },
                        DocID: 'dxCollectionWidget',
                        Module: 'test_widget'
                    },
                    dxExtensionWidget: {
                        IsExtensionComponent: true,
                        Options: {},
                        DocID: 'dxExtensionWidget',
                        Module: 'test_widget'
                    },
                    dxVizWidget: {
                        Options: {
                            value: {
                                DocID: 'Widget.Options.value',
                            }
                        },
                        DocID: 'dxVizWidget',
                        Module: 'viz/test_widget'
                    }
                }
            });
        });

        it("should read data using the path specified in config", function() {
            expect(store.read).toHaveBeenCalledWith(testConfig.sourceMetadataFilePath);
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(5);

            expect(store.write.calls.argsFor(0)[0]).toBe(path.join("output-path", "test-widget.json"));
            expect(store.write.calls.argsFor(1)[0]).toBe(path.join("output-path", "editor-widget.json"));
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(5);

            expect(metas.DxTestWidget).not.toBe(undefined);
            expect(metas.DxCollectionWidget).not.toBe(undefined);
            expect(metas.DxEditorWidget).not.toBe(undefined);
            expect(metas.DxExtensionWidget).not.toBe(undefined);
        });

        it("should generate proper component class name", function() {
            expect(metas.DxTestWidget.className).toBe("DxTestWidget");
        });

        it("should generate proper component selector", function() {
            expect(metas.DxTestWidget.selector).toBe("dx-test-widget");
        });

        it("should generate proper widget name", function() {
            expect(metas.DxTestWidget.widgetName).toBe("dxTestWidget");
        });
        
        it("should generate proper widget docID", function() {
            expect(metas.DxTestWidget.docID).toBe('dxTestWidget');
        });

        it("should generate proper events emit field", function() {
            expect(metas.DxTestWidget.events
                .map(p => p.emit)).toEqual([
                    'onTestEvent',
                    'testTemplateChange',
                    'testPropertyChange'
                ]
            );
        });
        
        it("should generate proper events subscribe field", function() {
            expect(metas.DxTestWidget.events
                .filter(p => p.subscribe !== undefined)
                .map(p => p.subscribe))
            .toEqual(['testEvent']);
        });
                
        it("should generate proper events docID field", function() {
            expect(metas.DxTestWidget.events
                .filter(p => p.emit === 'onTestEvent')
                .map(p => p.docID))
            .toEqual(['Widget.Options.onTestEvent']);
        });

        it("should generate proper events deprication field", function() {
            expect(metas.DxTestWidget.events
                .filter(p => p.emit === 'onTestEvent')
                .map(p => p.isDeprecated))
            .toEqual([true]);
        });

        it("should generate proper events docID field", function() {
            expect(metas.DxTestWidget.events
                .filter(p => p.emit !== "onTestEvent" && p.docID === undefined && p.isInternal === true).length)
            .toEqual(2);
        });

        it("should generate proper properties", function() {
            expect(metas.DxTestWidget.properties.map(p => p.type)).toEqual([
                'any',
                'any'
            ]);
        });
        
        it("should generate proper properties docID", function() {
            expect(metas.DxTestWidget.properties.map(p => p.docID)).toEqual([
                'Widget.Options.testTemplate',
                'Widget.Options.testProperty'
            ]);
        });

        it("should generate proper collection properties", function() {
            expect(metas.DxCollectionWidget.properties.map(p => p.type)).toEqual([
                'any',
                'any'
            ]);
        });

        it("should generate proper viz property", function() {
            expect(metas.DxTestWidget.isViz).toBe(false);
            expect(metas.DxVizWidget.isViz).toBe(true);
        });

        it("should generate proper module name", function() {
            expect(metas.DxTestWidget.module).toBe("widgetPackageName/test_widget");
        });

        it("should generate proper optionsTypeParams", function() {
            expect(metas.DxTestWidget.optionsTypeParams).toEqual(["T1", "T2"]);
        });

        it("should detect editors", function() {
            expect(metas.DxTestWidget.isEditor).toBe(false);
            expect(metas.DxEditorWidget.isEditor).toBe(true);
        });

        it("should detect extensions", function() {
            expect(metas.DxTestWidget.isExtension).toBe(false);
            expect(metas.DxExtensionWidget.isExtension).toBe(true);
        });

    });

    describe("typed components", function() {

        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxTypedWidget: {
                        Options: {
                            onTestEvent: {
                                IsEvent: true,
                            },
                            onTestTypedEvent: {
                                IsEvent: true,
                                TypeImports: [
                                    {
                                        "Name": "SomeEvent",
                                        "Path": "some/module"
                                    }
                                ]
                            },
                            simpleTypedProperty: {
                                PrimitiveTypes: [
                                    "boolean"
                                ]
                            },
                            multitypeProperty: {
                                PrimitiveTypes: [
                                    "string",
                                    "number"
                                ]
                            },
                            complexTypedProperty: {
                                PrimitiveTypes: [
                                    "dxComplexType1"
                                ],
                                TypeImports: [
                                    {
                                        Name: "dxComplexType1",
                                        Path: "ui/dx_complex_types"
                                    }
                                ]
                            },
                            collectionTypedProperty: {
                                IsCollection: true,
                                ItemPrimitiveTypes: [
                                    "string"
                                ]
                            },
                            collectionComplexTypedProperty: {
                                IsCollection: true,
                                ItemPrimitiveTypes: [
                                    "string",
                                    "dxComplexType2"
                                ],
                                TypeImports: [
                                    {
                                      Name: "dxComplexType2",
                                      Path: "ui/dx_complex_types"
                                    }
                                ]
                            },
                            dataSourceProperty: {
                                IsDataSource: true,
                                PrimitiveTypes: [
                                    "DevExpress.ui.DataSource",
                                    "DevExpress.ui.DataSourceConfig"
                                ],
                                ItemPrimitiveTypes: [
                                    "any"
                                ],
                                TypeImports: [
                                    {
                                        Name: "default",
                                        Alias: "DevExpress",
                                        Path: "bundles/dx.all"
                                    }
                                ]
                            }
                        },
                        Module: 'typed_widget'
                    },
                    dxWidgetWithPromise: {
                        Options: {
                            optionWithPromise: {
                                IsPromise: true,
                                PrimitiveTypes: [
                                    'boolean'
                                ],
                                ItemPrimitiveTypes: [
                                    'void'
                                ]
                            }
                        },
                        Module: 'test_widget'
                    }
                }
            });
        });

        it("should generate matadata", function() {
            expect(metas.DxTypedWidget).not.toBe(undefined);
            expect(metas.DxWidgetWithPromise).not.toBe(undefined);
        });

        it("should generate proper typed properties", function() {
            expect(metas.DxTypedWidget.properties.map(p => p.type)).toEqual([
                'boolean',
                'string' + TYPES_SEPORATOR + 'number',
                'dxComplexType1',
                'Array<string>',
                'Array<string' + TYPES_SEPORATOR + 'dxComplexType2>',
                'DevExpress.ui.DataSource' + TYPES_SEPORATOR + 'DevExpress.ui.DataSourceConfig' + TYPES_SEPORATOR + 'Array<any>'
            ]);
            expect(metas.DxWidgetWithPromise.properties.map(p => p.type)).toEqual([
                'boolean' + TYPES_SEPORATOR +
                'Promise<void> & JQueryPromise<void>'
            ]);
        });

        it("should generate proper typed events", function() {
            expect(metas.DxTypedWidget.events.map(p => p.type)).toEqual([
                'EventEmitter<any>',
                'EventEmitter<SomeEvent>',
                'EventEmitter<boolean>',
                'EventEmitter<string' + TYPES_SEPORATOR + 'number>',
                'EventEmitter<dxComplexType1>',
                'EventEmitter<Array<string>>',
                'EventEmitter<Array<string' + TYPES_SEPORATOR + 'dxComplexType2>>',
                'EventEmitter<DevExpress.ui.DataSource' + TYPES_SEPORATOR + 'DevExpress.ui.DataSourceConfig' + TYPES_SEPORATOR + 'Array<any>>'
            ]);
        });

        it("should generate type imports", function() {
            expect(metas.DxTypedWidget.imports).toEqual([
                {
                    importString: "DevExpress",
                    path: "widgetPackageName/bundles/dx.all",
                },
                {
                    importString: "{ SomeEvent }",
                    path: "widgetPackageName/some/module",
                },
                {
                    importString: "{ dxComplexType1, dxComplexType2 }",
                    path: "widgetPackageName/ui/dx_complex_types",
                }
            ]);
        });
    });

    describe("complex widgets", function() {

        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxComplexWidget: {
                        Options: {
                            property: { // DxoProperty
                                Options: {
                                    nested: { // DxoNested
                                        Options: {
                                            deep: {},
                                            changeable: {
                                                IsChangeable: true
                                            },
                                            readonly: {
                                                IsReadonly: true
                                            }
                                        }
                                    },
                                    nestedItems: { // DxiNestedItem
                                        Options: {
                                            deep: {},
                                            changeable: {
                                                IsChangeable: true
                                            },
                                            readonly: {
                                                IsReadonly: true
                                            }
                                        },
                                        IsCollection: true,
                                        SingularName: "nestedItem"
                                    },
                                    changeable: {
                                        IsChangeable: true
                                    },
                                    readonly: {
                                        IsReadonly: true
                                    }
                                }
                            },
                            collectionItem: { // DxoItem
                                Options: {
                                    nested: {},
                                    changeable: {
                                        IsChangeable: true
                                    },
                                    readonly: {
                                        IsReadonly: true
                                    }
                                }
                            },
                            collectionItems: { // DxiItem
                                Options: {
                                    nested: {},
                                    changeable: {
                                        IsChangeable: true
                                    },
                                    readonly: {
                                        IsReadonly: true
                                    }
                                },
                                IsCollection: true,
                                SingularName: "collectionItem"
                            },
                            collectionItemsWithTemplate: { // DxiCollectionItemWithTemplate
                                Options: {
                                    template: {
                                        IsTemplate: true
                                    }
                                },
                                IsCollection: true,
                                SingularName: "collectionItemWithTemplate"
                            }

                        },
                        Module: 'test_widget'
                    },
                    dxAnotherComplexWidget: {
                        Options: {
                            property: { // DxoProperty
                                Options: {
                                    anotherNested: {}
                                }
                            },
                            externalProperty: { // DxoExternalProperty
                                ComplexTypes: [
                                    'ExternalPropertyType'
                                ]
                            },
                            externalPropertyItems: { // DxiExternalPropertyItem
                                IsCollection: true,
                                SingularName: 'externalPropertyItem',
                                ItemComplexTypes: [
                                    'ExternalPropertyType'
                                ]
                            },
                            widgetReference: {
                                ComplexTypes: [
                                    'dxAnotherComplexWidgetOptions'
                                ]
                            }
                        },
                        Module: 'test_widget'
                    }
                },
                ExtraObjects: {
                    ExternalPropertyType: { // DxoExternalPropertyType
                        Options: {
                            nestedExternalProperty: { // DxoNestedExternalProperty
                                ComplexTypes: [
                                    'ExternalPropertyType'
                                ]
                            }
                        }
                    }
                }
            });
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(15);

            let writeToPathCount = (path) => {
                return store.write.calls
                    .allArgs()
                    .filter(args => args[0] === path).length;
            };

            expect(writeToPathCount(path.join("output-path", "complex-widget.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "another-complex-widget.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "base", "external-property-type.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "base", "external-property-type-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "base", "another-complex-widget-options.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "nested-external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "collection-item-with-template-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "widget-reference.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property-item-dxi.json"))).toBe(1);
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(15);

            expect(metas.DxComplexWidget).not.toBe(undefined);
            expect(metas.DxAnotherComplexWidget).not.toBe(undefined);
            expect(metas.DxoProperty).not.toBe(undefined);
            expect(metas.DxoNested).not.toBe(undefined);
            expect(metas.DxiNestedItem).not.toBe(undefined);
            expect(metas.DxoExternalProperty).not.toBe(undefined);
            expect(metas.DxoNestedExternalProperty).not.toBe(undefined);
            expect(metas.DxoExternalPropertyType).not.toBe(undefined);
            expect(metas.DxiCollectionItem).not.toBe(undefined);
            expect(metas.DxoCollectionItem).not.toBe(undefined);
            expect(metas.DxiCollectionItemWithTemplate).not.toBe(undefined);
            expect(metas.DxoWidgetReference).not.toBe(undefined);
            expect(metas.DxoAnotherComplexWidgetOptions).not.toBe(undefined);
            expect(metas.DxiExternalPropertyType).not.toBe(undefined);
            expect(metas.DxiExternalPropertyItem).not.toBe(undefined);
        });

        it("should generate nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');

            expect(metas.DxoProperty.properties.map(p => p.name)).toEqual(['nested', 'nestedItems', 'changeable', 'readonly', 'anotherNested']);
            expect(metas.DxoProperty.optionName).toBe('property');
        });

        it("should generate proper properties of base components", function() {
            expect(metas.DxoExternalPropertyType.properties.map(p => p.name)).toEqual(['nestedExternalProperty']);
            expect(metas.DxoExternalPropertyType.className).toBe('DxoExternalPropertyType');
            expect(metas.DxoExternalPropertyType.path).toBe('external-property-type');
            expect(metas.DxoExternalPropertyType.baseClass).toBe('NestedOption');
            expect(metas.DxoExternalPropertyType.basePath).toBe('devextreme-angular/core');
        });

        it("should generate proper properties of base collection components", function() {
            expect(metas.DxiExternalPropertyType.properties.map(p => p.name)).toEqual(['nestedExternalProperty']);
            expect(metas.DxiExternalPropertyType.className).toBe('DxiExternalPropertyType');
            expect(metas.DxiExternalPropertyType.path).toBe('external-property-type-dxi');
            expect(metas.DxiExternalPropertyType.baseClass).toBe('CollectionNestedOption');
            expect(metas.DxiExternalPropertyType.basePath).toBe('devextreme-angular/core');
        });

        it("should generate proper properties of collection nested components with base class", function() {
            expect(metas.DxiExternalPropertyItem.className).toBe('DxiExternalPropertyItem');
            expect(metas.DxiExternalPropertyItem.path).toBe('external-property-item-dxi');
            expect(metas.DxiExternalPropertyItem.baseClass).toBe('DxiExternalPropertyType');
            expect(metas.DxiExternalPropertyItem.basePath).toBe('./base/external-property-type-dxi');
        });

        it("should generate proper events emit field of if nested components isChangeable=true or isReadonly=true", function() {
            ['DxoProperty', 'DxoNested', 'DxiNestedItem', 'DxoCollectionItem', 'DxiCollectionItem'].forEach((component) => {
                expect(metas[component].events
                    .map(p => p.emit)).toEqual([
                        'changeableChange',
                        'readonlyChange'
                    ]
                );
            });
        });

        it("should generate deep nested components", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoNested');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).not.toContain('DxoNested');

            expect(metas.DxoNested.properties.map(p => p.name)).toEqual(['deep', 'changeable', 'readonly']);
            expect(metas.DxoNested.optionName).toBe('nested');
            expect(metas.DxoNested.baseClass).toBe('NestedOption');
            expect(metas.DxoNested.hasSimpleBaseClass).toBe(true);
        });

        it("should generate deep collection nested components", function() {
            expect(metas.DxoProperty.collectionNestedComponents.length).toBe(1);

            let nestedItem = metas.DxoProperty.collectionNestedComponents.filter(c => c.className === 'DxiNestedItem')[0];
            expect(nestedItem.className).toBe('DxiNestedItem');
            expect(nestedItem.path).toBe('nested-item-dxi');
            expect(nestedItem.propertyName).toBe('nestedItems');
        });

        it("should generate external nested components", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).not.toContain('DxoExternalProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoExternalProperty');

            expect(metas.DxoExternalProperty.properties).toBe(undefined);
            expect(metas.DxoExternalProperty.baseClass).toBe('DxoExternalPropertyType');
            expect(metas.DxoExternalProperty.hasSimpleBaseClass).toBe(undefined);
            expect(metas.DxoExternalProperty.optionName).toBe('externalProperty');
        });

        it("should generate recursive external nested components", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).not.toContain('DxoNestedExternalProperty');
            expect(metas.DxAnotherComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoNestedExternalProperty');

            expect(metas.DxoNestedExternalProperty.properties).toBe(undefined);
            expect(metas.DxoNestedExternalProperty.baseClass).toBe('DxoExternalPropertyType');
            expect(metas.DxoNestedExternalProperty.hasSimpleBaseClass).toBe(undefined);
            expect(metas.DxoNestedExternalProperty.optionName).toBe('nestedExternalProperty');
        });

        it("should generate collection nested components", function() {
            let collectionItem = metas.DxiCollectionItem;
            expect(collectionItem).not.toBe(undefined);
            expect(collectionItem.path).toBe('collection-item-dxi');
            expect(collectionItem.propertyName).toBe('collectionItems');
            expect(collectionItem.isCollection).toBe(true);
            expect(collectionItem.hasTemplate).toBe(undefined);
        });

        it("should set the 'root' property for nested components", function() {
            let rootNestedComponent = metas.DxComplexWidget.nestedComponents.filter(c => c.className === 'DxoProperty')[0];
            expect(rootNestedComponent.root).toBe(true);
            let nestedComponent = metas.DxComplexWidget.nestedComponents.filter(c => c.className === 'DxoNested')[0];
            expect(nestedComponent.root).toBe(undefined);
        });

        it("should generate collection nested components with templates", function() {
            let collectionItemWithTemplate = metas.DxComplexWidget.nestedComponents.filter(c => c.className === 'DxiCollectionItemWithTemplate')[0];
            expect(collectionItemWithTemplate).not.toBe(undefined);
            expect(collectionItemWithTemplate.hasTemplate).toBe(true);
        });

    });

    describe("collection of complex types", function() {

        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxComplexWidget: {
                        Options: {
                            externalProperty: { // DxoExternalProperty
                                ComplexTypes: [
                                    'ExternalPropertyType',
                                    'ExternalPropertyType2'
                                ]
                            },
                            externalPropertyItems: { // DxiExternalPropertyItem
                                IsCollection: true,
                                SingularName: 'externalPropertyItem',
                                ItemComplexTypes: [
                                    'ExternalPropertyType',
                                    'ExternalPropertyType2'
                                ]
                            }
                        },
                        Module: 'test_widget'
                    }
                },
                ExtraObjects: {
                    ExternalPropertyType: {
                        Options: {
                            property: {
                                Options: {
                                    nestedProperty1: {
                                        PrimitiveTypes: [ 'number' ]
                                    }
                                },
                                PrimitiveTypes: [
                                    'string'
                                ]
                            },
                            property1: {
                                PrimitiveTypes: [
                                    'string'
                                ]
                            },
                            property2: {

                            },
                            property3: {
                               Options: {
                                   nestedProperty1: {
                                       PrimitiveTypes: [ 'number' ]
                                   },
                                   nestedProperty2: {
                                       PrimitiveTypes: [ 'string' ]
                                   }
                               }
                           }

                        }
                    },
                    ExternalPropertyType2: {
                        Options: {
                            property: {
                                Options: {
                                    nestedProperty2: {
                                        PrimitiveTypes: [ 'string' ]
                                    }
                                },
                                PrimitiveTypes: [
                                    'boolean',
                                    'DevExpress.ui.dxComplexType',
                                    'dxComplexType1'
                                ],
                                TypeImports: [
                                    {
                                        Name: "dxComplexType1",
                                        Path: "ui/dx_complex_types"
                                    },
                                    {
                                        Name: "default",
                                        Alias: "DevExpress",
                                        Path: "bundles/dx.all"
                                    }
                                ]
                            },
                            property1: {
                                PrimitiveTypes: [
                                    'string'
                                ],
                                TypeImports: [
                                    {
                                        Name: "dxComplexType2",
                                        Path: "ui/dx_complex_types"
                                    }
                                ]
                            },
                            property3: {
                            },
                            property4: {
                            }
                        }
                    }
                }
            });
        });

        it("should write generated data to a separate file for each widget", function() {
            expect(store.write.calls.count()).toBe(5);

            let writeToPathCount = (path) => {
                return store.write.calls
                    .allArgs()
                    .filter(args => args[0] === path).length;
            };

            expect(writeToPathCount(path.join("output-path", "complex-widget.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "external-property-item-dxi.json"))).toBe(1);
            expect(writeToPathCount(path.join("output-path", "nested", "property.json"))).toBe(1);
        });

        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(5);

            expect(metas.DxComplexWidget).not.toBe(undefined);
            expect(metas.DxoExternalProperty).not.toBe(undefined);
            expect(metas.DxiExternalPropertyItem).not.toBe(undefined);
            expect(metas.DxoProperty).not.toBe(undefined);
        });

        it("should generate nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoExternalProperty');

            expect(metas.DxoExternalProperty.properties.map(p => p.name)).toEqual(['property', 'property1', 'property2', 'property3', 'property4']);
            expect(metas.DxoExternalProperty.optionName).toBe('externalProperty');
        });

        it("should generate collection nested components with merged properties", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxiExternalPropertyItem');

            expect(metas.DxiExternalPropertyItem.properties.map(p => p.name)).toEqual(['property', 'property1', 'property2', 'property3', 'property4']);
            expect(metas.DxiExternalPropertyItem.optionName).toBe('externalPropertyItems');
        });

        it("should generate nested components with merged properties of external types", function() {
            expect(metas.DxComplexWidget.nestedComponents.map(c => c.className)).toContain('DxoProperty');

            expect(metas.DxoProperty.properties.map(p => p.name)).toEqual(['nestedProperty1', 'nestedProperty2']);
            expect(metas.DxoProperty.optionName).toBe('property');
        });
            
        it("should generate nested components with merged types of repetitive properties", function() {
            expect(metas.DxoExternalProperty.properties.map(p => p.type))
            .toEqual([
                    'string' + TYPES_SEPORATOR +
                    '{ nestedProperty1?: number }' + TYPES_SEPORATOR +
                    'boolean' + TYPES_SEPORATOR + 
                    'DevExpress.ui.dxComplexType' + TYPES_SEPORATOR + "dxComplexType1" + TYPES_SEPORATOR + 
                    '{ nestedProperty2?: string }',
                    'string', 
                    'any', 
                    '{ nestedProperty1?: number, nestedProperty2?: string }',
                    'any'
                ]);
        });

        it("should generate type imports for merged nested components", function() {
            expect(metas.DxoExternalProperty.imports).toEqual([
                {
                    importString: "DevExpress",
                    path: "widgetPackageName/bundles/dx.all",
                },
                {
                    importString: "{ dxComplexType1, dxComplexType2 }",
                    path: "widgetPackageName/ui/dx_complex_types",
                }
            ]);
        });
    });

    
    describe("typed complex components", function() {
        
        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxComplexWidget: {
                        Options: {
                            property: { // DxoProperty
                                Options: {
                                    nested: { // DxoNested
                                        Options: {
                                            deep: {
                                                PrimitiveTypes: [
                                                    "boolean",
                                                    "dxComplexType1"
                                                ],                    
                                                ComplexTypes: [
                                                    'ExternalPropertyType'
                                                ],
                                                TypeImports: [
                                                    {
                                                        Name: "dxComplexType1",
                                                        Path: "ui/dx_complex_types"
                                                    }
                                                ]
                                            },
                                            collectionDeeps : {
                                                PrimitiveTypes: [
                                                    "boolean"
                                                ], 
                                                ItemPrimitiveTypes: [
                                                    "number"
                                                ],                    
                                                Options: {
                                                    value: {
                                                        PrimitiveTypes: [
                                                            "string"
                                                        ]
                                                    }
                                                },
                                                IsCollection: true,
                                                SingularName: "collectionDeep"                                                
                                            },
                                            deepWithPromise: {
                                                IsPromise: true,
                                                ItemPrimitiveTypes: [
                                                    "boolean"
                                                ]
                                            }
                                        },
                                        PrimitiveTypes: [
                                            "string",
                                            "dxComplexType2"
                                        ],                    
                                        ComplexTypes: [
                                            'ExternalPropertyType'
                                        ],
                                        TypeImports: [
                                            {
                                                Name: "dxComplexType2",
                                                Path: "ui/dx_complex_types"
                                            }
                                        ]
                                    },
                                    nestedItems: { // DxiNestedItem
                                        Options: {
                                            deep: {
                                                PrimitiveTypes: [
                                                    "string"
                                                ]
                                            }
                                        },
                                        ItemPrimitiveTypes: [
                                            "string",
                                            "dxComplexType3"
                                        ],
                                        IsCollection: true,
                                        SingularName: "nestedItem",
                                        TypeImports: [
                                            {
                                                Name: "dxComplexType3",
                                                Path: "ui/dx_other_complex_types"
                                            }
                                        ]
                                    }
                                },
                                PrimitiveTypes: [
                                    "string"
                                ],                    
                                ComplexTypes: [
                                    'ExternalPropertyType'
                                ]
                            },
                            collectionItem: { // DxoItem
                                Options: {
                                    nested: {}
                                },
                                PrimitiveTypes: [
                                    "string"
                                ]
                            },
                            collectionItems: { // DxiItem
                                Options: {
                                    nested: {}
                                },
                                IsCollection: true,
                                SingularName: "collectionItem",
                                ItemPrimitiveTypes: [
                                    "string"
                                ]
                            }

                        },
                        Module: 'test_widget'
                    }
                },                    
                ExtraObjects: {
                    ExternalPropertyType: { // DxoExternalPropertyType
                        Options: {
                            nestedExternalProperty: { // DxoNestedExternalProperty
                                PrimitiveTypes: [
                                  'dxComplexType4'  
                                ],
                                ComplexTypes: [
                                    'ExternalPropertyType'
                                ],
                                TypeImports: [
                                    {
                                        Name: "dxComplexType4",
                                        Path: "ui/dx_other_complex_types"
                                    }
                                ]
                            }
                        }
                    }
                }
            });
        });
                    
        it("should generate matadata", function() {
            expect(Object.keys(metas).length).toBe(10);

            expect(metas.DxComplexWidget).not.toBe(undefined);
            expect(metas.DxoExternalPropertyType).not.toBe(undefined);
            expect(metas.DxoNestedExternalProperty).not.toBe(undefined);
            expect(metas.DxoDeep).not.toBe(undefined);
            expect(metas.DxoProperty).not.toBe(undefined);
            expect(metas.DxoNested).not.toBe(undefined);
            expect(metas.DxiNestedItem).not.toBe(undefined);
            expect(metas.DxiCollectionItem).not.toBe(undefined);
            expect(metas.DxoCollectionItem).not.toBe(undefined);
            expect(metas.DxiCollectionDeep).not.toBe(undefined);
        });

        it("should generate proper typed properties", function() {
            expect(metas.DxoProperty.properties.map(p => p.type)).toEqual([
                `string${TYPES_SEPORATOR}dxComplexType2${TYPES_SEPORATOR}` +
                `{ deep?: boolean${TYPES_SEPORATOR}dxComplexType1, ` +
                `collectionDeeps?: boolean${TYPES_SEPORATOR}Array<number${TYPES_SEPORATOR}{ value?: string }>, ` +
                `deepWithPromise?: Promise<boolean> & JQueryPromise<boolean> }`,

                `Array<string${TYPES_SEPORATOR}dxComplexType3${TYPES_SEPORATOR}{ deep?: string }>`
            ]);
        });

        it("should generate type imports", function() {

            expect(metas.DxoProperty.imports).toEqual([
                {
                    path: "widgetPackageName/ui/dx_complex_types",
                    importString: "{ dxComplexType1, dxComplexType2 }",
                },
                {
                    path: "widgetPackageName/ui/dx_other_complex_types",
                    importString: "{ dxComplexType3 }",
                }
            ]);

            expect(metas.DxoNested.imports).toEqual([
                {
                    path: "widgetPackageName/ui/dx_complex_types",
                    importString: "{ dxComplexType1 }",
                }
            ]);

            expect(metas.DxoExternalPropertyType.imports).toEqual([
                {
                    path: "widgetPackageName/ui/dx_other_complex_types",
                    importString: "{ dxComplexType4 }",
                }
            ]);
        });

        it("should not generate type imports if not required", function() {
            expect(metas.DxiNestedItem.imports).toBeUndefined()
            expect(metas.DxiCollectionItem.imports).toBeUndefined()
            expect(metas.DxoCollectionItem.imports).toBeUndefined()
            expect(metas.DxoNestedExternalProperty.imports).toBeUndefined()
            expect(metas.DxoDeep.imports).toBeUndefined()
        });
    });
    
    describe("deprecated components", function() {
        
        beforeEach(function() {
            setupContext({
                Widgets: {
                    dxTestWidget: {
                        Options: {
                            testProperty: {
                                PrimitiveTypes: [
                                    'boolean'
                                ]
                            }
                        },
                        Module: 'test_widget'
                    },
                }
            }, {
                Widgets: {
                    dxTestWidget: {
                        Options: {
                            secondTestProperty: {
                                PrimitiveTypes: [
                                    "number"
                                ]
                            },
                            typedTestProperty: {
                                ComplexTypes: [
                                    "DeprecatedType"
                                ]
                            }
                        }
                    },
                    dxEditorWidget: {
                        Options: {
                            onValueChanged: {}
                        },
                        Module: 'test_widget'
                    },
                },
                ExtraObjects: {
                    DeprecatedType: {
                        Options: {
                            simpleOption: true
                        },
                        Module: 'test_widget'
                    }
                }
            });
        });

        it("should merge source metadata with deprecated data", function() {
            expect(metas.DxTestWidget.properties.length).toBe(3);
            expect(metas.DxTestWidget.nestedComponents.map(c => c.className)).toContain('DxoTypedTestProperty');
            expect(metas.DxoTypedTestProperty).not.toBe(undefined);
            expect(metas.DxEditorWidget).not.toBe(undefined);
            expect(metas.DxoDeprecatedType).not.toBe(undefined);
        });
    });
});

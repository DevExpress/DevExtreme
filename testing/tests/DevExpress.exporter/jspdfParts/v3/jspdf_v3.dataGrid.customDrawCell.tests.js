import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfCustomDrawCellTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        const logoBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6P+H/AMG9a+JljqGrCSx0rw/pf7zU9e1e6Wz02wHGWlnfjPI4GW5HFeafEn9tD4A/BW/a1sdV8ZfFLVrVvml0OOPR9KDjqq3M6ySvg9GWEA9QelfNX7en7fniX9rnxZ/Y8EEnhT4b+HZ3h0HwrBmKG0RWIEtwoJ8y5IJLMxOCWC4yc/PUEEl1OkUSNJJIwVEUbmYngADuTX4/w14NZLgaUZ5jH29Xq22op+UVa685XvvZbH6zxF4vZxjarjgH7Cl0SScmvOTvZ+UbW2u9z//Z';

        QUnit.module('Custom draw cell event', moduleConfig, () => {
            QUnit.test('cell1.customDrawCell = empty function', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f1') {
                        pdfCell.customDrawCell = () => { };
                    }
                };

                const expectedLog = [
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell2.customDrawCell = empty function', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f2') {
                        pdfCell.customDrawCell = (rect) => { };
                    }
                };

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell1.customDrawCell = drawRect', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f1') {
                        pdfCell.customDrawCell = (rect) => {
                            doc.rect(rect.x, rect.y, rect.w, rect.h, 'F');
                        };
                    }
                };

                const expectedLog = [
                    'rect,10,10,250,18.4,F',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell2.customDrawCell = drawRect', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f2') {
                        pdfCell.customDrawCell = (rect) => {
                            doc.rect(rect.x, rect.y, rect.w, rect.h, 'F');
                        };
                    }
                };

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'rect,260,10,250,18.4,F',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell1.customDrawCell = drawLink', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f1') {
                        pdfCell.customDrawCell = (rect) => {
                            doc.textWithLink('Click here', rect.x, rect.y + rect.h - 1, { url: 'http://www.google.com' });
                        };
                    }
                };

                const expectedLog = [
                    'text,Click here,10,27.4,{url:http://www.google.com}',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell2.customDrawCell = drawLink', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f2') {
                        pdfCell.customDrawCell = (rect) => {
                            doc.textWithLink('Click here', rect.x, rect.y + rect.h - 1, { url: 'http://www.google.com' });
                        };
                    }
                };

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'text,Click here,260,27.4,{url:http://www.google.com}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell1.customDrawCell = drawImage', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f1') {
                        pdfCell.customDrawCell = (rect) => {
                            doc.addImage(logoBase64, 'JPEG', rect.x, rect.y, 16, 16);
                        };
                    }
                };

                const expectedLog = [
                    'addImage,someImage,JPEG,10,10,16,16',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell2.customDrawCell = drawImage', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'f2') {
                        pdfCell.customDrawCell = (rect) => {
                            doc.addImage(logoBase64, 'JPEG', rect.x, rect.y, 16, 16);
                        };
                    }
                };

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'addImage,someImage,JPEG,260,10,16,16',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('customDrawCell check event arg', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.customDrawCell = (rect, cell) => {
                        assert.deepEqual(rect, { h: 18.4, w: 500, x: 10, y: 10 });
                        assert.deepEqual(cell, {
                            backgroundColor: undefined,
                            horizontalAlign: 'left',
                            padding: {
                                bottom: 0,
                                left: 0,
                                right: 0,
                                top: 0
                            },
                            text: 'f1',
                            verticalAlign: 'middle',
                            wordWrapEnabled: false
                        });
                    };
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    done();
                });
            });
        });
    }
};

export { JSPdfCustomDrawCellTests };

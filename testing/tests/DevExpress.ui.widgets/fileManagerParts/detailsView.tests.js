import $ from "jquery";
import "ui/file_manager";
import fx from "animation/fx";
import { Consts } from "../../../helpers/fileManagerHelpers.js";

const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#fileManager").dxFileManager({
            itemView: {
                mode: "details",
                showParentFolder: false
            },
            fileProvider: [
                {
                    name: "Folder 1",
                    isFolder: true
                },
                {
                    name: "1.txt",
                    isFolder: false,
                    length: 0
                },
                {
                    name: "2.txt",
                    isFolder: false,
                    length: 200
                },
                {
                    name: "3.txt",
                    isFolder: false,
                    length: 1024
                },
                {
                    name: "4.txt",
                    isFolder: false,
                    length: 1300
                }
            ]
        });

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

const getFileSizeCellValueInDetailsView = ($element, rowIndex) => {
    return $element.find(`tr.${Consts.GRID_DATA_ROW_CLASS}[aria-rowindex=${rowIndex}] td`)
        .eq(4)
        .text();
};

QUnit.module("Details View", moduleConfig, () => {

    test("Format file sizes", function(assert) {
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 1).trim(), "", "Folder shouldn't display own size.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 2), "0 B", "Incorrect formating of size column.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 3), "200 B", "Incorrect formating of size column.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 4), "1 KB", "Incorrect formating of size column.");
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 5), "1.3 KB", "Incorrect formating of size column.");
    });

});

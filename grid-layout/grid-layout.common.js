"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directionProperty = exports.isRtlProperty = exports.Common = void 0;
var grid_layout_1 = require("@nativescript/core/ui/layouts/grid-layout");
var ui_1 = require("@nativescript/core/ui");
var Common = (function (_super) {
    __extends(Common, _super);
    function Common() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Common;
}(grid_layout_1.GridLayout));
exports.Common = Common;
exports.isRtlProperty = new ui_1.Property({
    name: "isRtl",
    defaultValue: true,
    valueConverter: function (v) {
        var lowercase = (v + "").toLowerCase();
        if (lowercase === "true") {
            return true;
        }
        else if (lowercase === "false") {
            return false;
        }
        throw new Error("Invalid boolean: " + v);
    }
});
exports.isRtlProperty.register(Common);
exports.directionProperty = new ui_1.CssProperty({
    name: "direction",
    cssName: "direction",
    defaultValue: "rtl",
    affectsLayout: true,
    valueConverter: function (value) {
        var val = value.toLocaleLowerCase();
        if (val === "rtl" || val === "ltr") {
            return val;
        }
        throw new Error("Invalid string: " + val);
    }
});
exports.directionProperty.register(ui_1.Style);
//# sourceMappingURL=grid-layout.common.js.map
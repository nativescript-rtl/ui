"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var properties_1 = require("tns-core-modules/ui/core/properties/properties");
var Common = (function (_super) {
    __extends(Common, _super);
    function Common() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Common;
}(stack_layout_1.StackLayout));
exports.Common = Common;
exports.isRtlProperty = new properties_1.Property({
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
exports.directionProperty = new properties_1.CssProperty({
    name: "direction",
    cssName: "direction",
    defaultValue: "rtl",
    valueConverter: function (value) {
        var val = value.toLocaleLowerCase();
        if (val === "rtl" || val === "ltr") {
            return val;
        }
        throw new Error("Invalid string: " + val);
    }
});
exports.directionProperty.register(properties_1.Style);
//# sourceMappingURL=stack-layout.common.js.map
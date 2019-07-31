function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("../core/view");
var color_1 = require("../../color");
__export(require("../core/view"));
var SwitchBase = (function (_super) {
    __extends(SwitchBase, _super);
    function SwitchBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchBase.prototype._onCheckedPropertyChanged = function (newValue) {
    };
    SwitchBase.checkedChangeEvent = "checkedChange";
    SwitchBase = __decorate([
        view_1.CSSType("Switch")
    ], SwitchBase);
    return SwitchBase;
}(view_1.View));
exports.SwitchBase = SwitchBase;
SwitchBase.prototype.recycleNativeView = "auto";
function onCheckedPropertyChanged(switchBase, oldValue, newValue) {
    switchBase._onCheckedPropertyChanged(newValue);
}
exports.checkedProperty = new view_1.Property({ name: "checked", defaultValue: false, valueConverter: view_1.booleanConverter, valueChanged: onCheckedPropertyChanged });
exports.checkedProperty.register(SwitchBase);
exports.offBackgroundColorProperty = new view_1.Property({ name: "offBackgroundColor", equalityComparer: color_1.Color.equals, valueConverter: function (v) { return new color_1.Color(v); } });
exports.offBackgroundColorProperty.register(SwitchBase);
//# sourceMappingURL=switch-common.js.map
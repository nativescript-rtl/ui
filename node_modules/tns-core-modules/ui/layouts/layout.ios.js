function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var layout_base_1 = require("./layout-base");
__export(require("./layout-base"));
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Layout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
    };
    return Layout;
}(layout_base_1.LayoutBase));
exports.Layout = Layout;
//# sourceMappingURL=layout.ios.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grid_layout_common_1 = require("./grid-layout.common");
var GridLayout = (function (_super) {
    __extends(GridLayout, _super);
    function GridLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridLayout.prototype.createNativeView = function () {
        var _this = this;
        var view = _super.prototype.createNativeView.call(this);
        view.setRotationY(180);
        setTimeout(function () {
            for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                var NSView = _this["getChildAt"](viewIndex);
                NSView.nativeView.setRotationY(180);
            }
        }, 1);
        return view;
    };
    return GridLayout;
}(grid_layout_common_1.Common));
exports.GridLayout = GridLayout;
//# sourceMappingURL=grid-layout.android.js.map
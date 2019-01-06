"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dock_layout_common_1 = require("./dock-layout.common");
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DockLayout.prototype.createNativeView = function () {
        var _this = this;
        var view = _super.prototype.createNativeView.call(this);
        if (this.isRtl) {
            view.setRotationY(180);
            setTimeout(function () {
                for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                    var NSView = _this["getChildAt"](viewIndex);
                    var isRtl = NSView["isRtl"] || false;
                    if (isRtl) {
                        NSView.nativeView.setRotationY(0);
                    }
                    else {
                        NSView.nativeView.setRotationY(180);
                    }
                }
            }, 1);
        }
        return view;
    };
    return DockLayout;
}(dock_layout_common_1.Common));
exports.DockLayout = DockLayout;
//# sourceMappingURL=dock-layout.android.js.map
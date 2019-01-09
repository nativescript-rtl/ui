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
    DockLayout.prototype.addChild = function (view) {
        var _this = this;
        _super.prototype.addChild.call(this, view);
        setTimeout(function () {
            if (_this.isRtl) {
                view.nativeView.setRotationY(180);
            }
            else {
                view.nativeView.setRotationY(0);
            }
        }, 1);
    };
    DockLayout.prototype.removeChild = function (view) {
        var _this = this;
        _super.prototype.removeChild.call(this, view);
        setTimeout(function () {
            if (_this.isRtl) {
                view.nativeView.setRotationY(180);
            }
            else {
                view.nativeView.setRotationY(0);
            }
        }, 1);
    };
    return DockLayout;
}(dock_layout_common_1.Common));
exports.DockLayout = DockLayout;
//# sourceMappingURL=dock-layout.android.js.map
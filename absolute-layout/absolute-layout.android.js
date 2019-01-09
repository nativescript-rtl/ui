"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var absolute_layout_common_1 = require("./absolute-layout.common");
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbsoluteLayout.prototype.createNativeView = function () {
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
    AbsoluteLayout.prototype.addChild = function (view) {
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
    AbsoluteLayout.prototype.removeChild = function (view) {
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
    return AbsoluteLayout;
}(absolute_layout_common_1.Common));
exports.AbsoluteLayout = AbsoluteLayout;
//# sourceMappingURL=absolute-layout.android.js.map
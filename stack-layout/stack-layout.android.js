"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stack_layout_common_1 = require("./stack-layout.common");
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackLayout.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._updateDirection();
    };
    StackLayout.prototype[stack_layout_common_1.isRtlProperty.setNative] = function (isRtl) {
        this.isRtl = isRtl;
        this._updateDirection();
    };
    StackLayout.prototype[stack_layout_common_1.directionProperty.setNative] = function (direction) {
        if (direction === "rtl") {
            this.isRtl = true;
        }
        else if (direction === "ltr") {
            this.isRtl = false;
        }
        this._updateDirection();
    };
    StackLayout.prototype.addChild = function (view) {
        _super.prototype.addChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    StackLayout.prototype.removeChild = function (view) {
        _super.prototype.removeChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    StackLayout.prototype._updateDirection = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.isRtl) {
                _this.nativeViewProtected.setRotationY(180);
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
            }
            else {
                _this.nativeViewProtected.setRotationY(0);
                for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                    var NSView = _this["getChildAt"](viewIndex);
                    NSView.nativeView.setRotationY(0);
                }
            }
        }, 1);
    };
    return StackLayout;
}(stack_layout_common_1.Common));
exports.StackLayout = StackLayout;
//# sourceMappingURL=stack-layout.android.js.map
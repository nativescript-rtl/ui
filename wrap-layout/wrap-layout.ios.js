"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_layout_common_1 = require("./wrap-layout.common");
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrapLayout.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._updateDirection();
    };
    WrapLayout.prototype[wrap_layout_common_1.isRtlProperty.setNative] = function (isRtl) {
        this.isRtl = isRtl;
        this._updateDirection();
    };
    WrapLayout.prototype.addChild = function (view) {
        _super.prototype.addChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    WrapLayout.prototype.removeChild = function (view) {
        _super.prototype.removeChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    WrapLayout.prototype._updateDirection = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.isRtl) {
                _this.nativeViewProtected.transform = CGAffineTransformMakeRotation((180.0 * Math.PI) / 180.0);
                for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                    var NSView = _this["getChildAt"](viewIndex);
                    var isRtl = NSView["isRtl"] || false;
                    if (isRtl) {
                        NSView.nativeView.transform = CGAffineTransformMakeRotation(0);
                    }
                    else {
                        NSView.nativeView.transform = CGAffineTransformMakeRotation((180.0 * Math.PI) / 180.0);
                    }
                }
            }
            else {
                _this.nativeViewProtected.setRotationY(0);
                for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                    var NSView = _this["getChildAt"](viewIndex);
                    NSView.nativeView.transform = CGAffineTransformMakeRotation(0);
                }
            }
        }, 1);
    };
    return WrapLayout;
}(wrap_layout_common_1.Common));
exports.WrapLayout = WrapLayout;
//# sourceMappingURL=wrap-layout.ios.js.map
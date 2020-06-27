"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_layout_common_1 = require("./wrap-layout.common");
var platform_1 = require("tns-core-modules/platform");
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
        var ZeroRotation = CATransform3DRotate(CATransform3DIdentity, 0.0, 0.0, 0.0, 0.0);
        var RotationInYAxis180Deg = CATransform3DRotate(CATransform3DIdentity, (180 * Math.PI) / 180.0, 0.0, 1.0, 0.0);
        setTimeout(function () {
            if (_this.isRtl) {
                _this.nativeViewProtected.layer.transform = RotationInYAxis180Deg;
                _this.nativeViewProtected.layer.rasterizationScale = platform_1.screen.mainScreen.scale;
                for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                    var NSView = _this["getChildAt"](viewIndex);
                    var isRtl = NSView["isRtl"] || false;
                    if (isRtl) {
                        NSView.nativeView.layer.transform = ZeroRotation;
                    }
                    else {
                        NSView.nativeView.layer.transform = RotationInYAxis180Deg;
                        _this.nativeViewProtected.layer.rasterizationScale = platform_1.screen.mainScreen.scale;
                    }
                }
            }
            else {
                _this.nativeViewProtected.layer.transform = ZeroRotation;
                for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                    var NSView = _this["getChildAt"](viewIndex);
                    NSView.nativeView.layer.transform = ZeroRotation;
                }
            }
        }, 1);
    };
    return WrapLayout;
}(wrap_layout_common_1.Common));
exports.WrapLayout = WrapLayout;
//# sourceMappingURL=wrap-layout.ios.js.map
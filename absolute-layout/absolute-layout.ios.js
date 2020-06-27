"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var absolute_layout_common_1 = require("./absolute-layout.common");
var platform_1 = require("tns-core-modules/platform");
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbsoluteLayout.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._updateDirection();
    };
    AbsoluteLayout.prototype[absolute_layout_common_1.isRtlProperty.setNative] = function (isRtl) {
        this.isRtl = isRtl;
        this._updateDirection();
    };
    AbsoluteLayout.prototype.addChild = function (view) {
        _super.prototype.addChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    AbsoluteLayout.prototype.removeChild = function (view) {
        _super.prototype.removeChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    AbsoluteLayout.prototype._updateDirection = function () {
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
                        NSView.nativeViewProtected.layer.rasterizationScale = platform_1.screen.mainScreen.scale;
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
    return AbsoluteLayout;
}(absolute_layout_common_1.Common));
exports.AbsoluteLayout = AbsoluteLayout;
//# sourceMappingURL=absolute-layout.ios.js.map
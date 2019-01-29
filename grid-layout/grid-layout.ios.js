"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grid_layout_common_1 = require("./grid-layout.common");
var GridLayout = (function (_super) {
    __extends(GridLayout, _super);
    function GridLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridLayout.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        this._updateDirection();
    };
    GridLayout.prototype[grid_layout_common_1.isRtlProperty.setNative] = function (isRtl) {
        this.isRtl = isRtl;
        this._updateDirection();
    };
    GridLayout.prototype.addChild = function (view) {
        _super.prototype.addChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    GridLayout.prototype.removeChild = function (view) {
        _super.prototype.removeChild.call(this, view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    };
    GridLayout.prototype._updateDirection = function () {
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
    return GridLayout;
}(grid_layout_common_1.Common));
exports.GridLayout = GridLayout;
//# sourceMappingURL=grid-layout.ios.js.map
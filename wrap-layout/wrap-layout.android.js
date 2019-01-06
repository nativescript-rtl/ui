"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrap_layout_common_1 = require("./wrap-layout.common");
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WrapLayout.prototype.createNativeView = function () {
        var _this = this;
        var view = _super.prototype.createNativeView.call(this);
        if (this.isRtl) {
            view.setRotationY(180);
            setTimeout(function () {
                for (var viewIndex = 0; viewIndex < _this["getChildrenCount"](); viewIndex++) {
                    var NSView = _this["getChildAt"](viewIndex);
                    var isRtl = NSView["isRtl"] || false;
                    console.log(NSView.typeName + " - " + isRtl);
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
    return WrapLayout;
}(wrap_layout_common_1.Common));
exports.WrapLayout = WrapLayout;
//# sourceMappingURL=wrap-layout.android.js.map
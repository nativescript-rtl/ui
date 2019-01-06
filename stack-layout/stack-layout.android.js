"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stack_layout_common_1 = require("./stack-layout.common");
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StackLayout.prototype.createNativeView = function () {
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
    return StackLayout;
}(stack_layout_common_1.Common));
exports.StackLayout = StackLayout;
//# sourceMappingURL=stack-layout.android.js.map
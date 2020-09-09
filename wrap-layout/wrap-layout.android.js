"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapLayout = void 0;
const wrap_layout_common_1 = require("./wrap-layout.common");
__exportStar(require("./wrap-layout.common"), exports);
class WrapLayout extends wrap_layout_common_1.Common {
    initNativeView() {
        super.initNativeView();
        this._updateDirection();
    }
    [wrap_layout_common_1.isRtlProperty.setNative](isRtl) {
        this.isRtl = isRtl;
        this._updateDirection();
    }
    [wrap_layout_common_1.directionProperty.setNative](direction) {
        if (direction === "rtl") {
            this.isRtl = true;
        }
        else if (direction === "ltr") {
            this.isRtl = false;
        }
        this._updateDirection();
    }
    addChild(view) {
        super.addChild(view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    }
    removeChild(view) {
        super.removeChild(view);
        if (view.nativeViewProtected) {
            this._updateDirection();
        }
    }
    _updateDirection() {
        setTimeout(() => {
            if (this.isRtl) {
                this.nativeViewProtected.setRotationY(180);
                for (let viewIndex = 0; viewIndex < this["getChildrenCount"](); viewIndex++) {
                    let NSView = this["getChildAt"](viewIndex);
                    let isRtl = NSView["isRtl"] || false;
                    if (isRtl) {
                        NSView.nativeView.setRotationY(0);
                    }
                    else {
                        NSView.nativeView.setRotationY(180);
                    }
                }
            }
            else {
                this.nativeViewProtected.setRotationY(0);
                for (let viewIndex = 0; viewIndex < this["getChildrenCount"](); viewIndex++) {
                    let NSView = this["getChildAt"](viewIndex);
                    NSView.nativeView.setRotationY(0);
                }
            }
        }, 1);
    }
}
exports.WrapLayout = WrapLayout;
//# sourceMappingURL=wrap-layout.android.js.map
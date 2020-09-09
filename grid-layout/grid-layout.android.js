"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridLayout = void 0;
const grid_layout_common_1 = require("./grid-layout.common");
class GridLayout extends grid_layout_common_1.Common {
    initNativeView() {
        super.initNativeView();
        this._updateDirection();
    }
    [grid_layout_common_1.isRtlProperty.setNative](isRtl) {
        this.isRtl = isRtl;
        this._updateDirection();
    }
    [grid_layout_common_1.directionProperty.setNative](direction) {
        console.log("I called!");
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
exports.GridLayout = GridLayout;
//# sourceMappingURL=grid-layout.android.js.map
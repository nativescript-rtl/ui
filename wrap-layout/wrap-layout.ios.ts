import { Common, isRtlProperty } from "./wrap-layout.common";
import { View } from "tns-core-modules/ui/core/view/view";

export class WrapLayout extends Common {
  public initNativeView(): void {
    super.initNativeView();
    this._updateDirection();
  }

  [isRtlProperty.setNative](isRtl: boolean): void {
    this.isRtl = isRtl;
    this._updateDirection();
  }

  public addChild(view: View): void {
    super.addChild(view);
    if (view.nativeViewProtected) {
      this._updateDirection();
    }
  }

  public removeChild(view: View): void {
    super.removeChild(view);
    if (view.nativeViewProtected) {
      this._updateDirection();
    }
  }

  private _updateDirection(): void {
    setTimeout(() => {
      if (this.isRtl) {
        this.nativeViewProtected.transform = CGAffineTransformMakeRotation(
          (180.0 * Math.PI) / 180.0
        );
        for (
          let viewIndex = 0;
          viewIndex < this["getChildrenCount"]();
          viewIndex++
        ) {
          let NSView: View = this["getChildAt"](viewIndex);
          let isRtl: boolean = NSView["isRtl"] || false;
          if (isRtl) {
            NSView.nativeView.transform = CGAffineTransformMakeRotation(0);
          } else {
            NSView.nativeView.transform = CGAffineTransformMakeRotation(
              (180.0 * Math.PI) / 180.0
            );
          }
        }
      } else {
        this.nativeViewProtected.setRotationY(0);
        for (
          let viewIndex = 0;
          viewIndex < this["getChildrenCount"]();
          viewIndex++
        ) {
          let NSView: View = this["getChildAt"](viewIndex);
          NSView.nativeView.transform = CGAffineTransformMakeRotation(0);
        }
      }
    }, 1);
  }
}

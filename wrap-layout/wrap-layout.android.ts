import { Common, isRtlProperty } from "./wrap-layout.common";
import { View } from "tns-core-modules/ui/page/page";
export * from "./wrap-layout.common";

export class WrapLayout extends Common {
  public initNativeView(): void {
    super.initNativeView();
    this._updateDirection();
  }

  [isRtlProperty.getDefault](): boolean {
    let ViewCompat = android.support.v4.view.ViewCompat;
    let isRtl = ViewCompat.getLayoutDirection(this.nativeViewProtected) === ViewCompat.LAYOUT_DIRECTION_RTL;
    console.log(isRtl);
    return isRtl;
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
        this.nativeViewProtected.setRotationY(180);
        for (
          let viewIndex = 0;
          viewIndex < this["getChildrenCount"]();
          viewIndex++
        ) {
          let NSView: View = this["getChildAt"](viewIndex);
          let isRtl: boolean = NSView["isRtl"] || false;
          if (isRtl) {
            NSView.nativeView.setRotationY(0);
          } else {
            NSView.nativeView.setRotationY(180);
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
          NSView.nativeView.setRotationY(0);
        }
      }
    }, 1);
  }
}

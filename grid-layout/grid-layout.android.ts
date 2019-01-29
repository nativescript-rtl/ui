import { Common, isRtlProperty } from "./grid-layout.common";
import { View } from "tns-core-modules/ui/page/page";

export class GridLayout extends Common {
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

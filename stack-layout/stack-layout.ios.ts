import { Common, isRtlProperty } from "./stack-layout.common";
import { View } from "@nativescript/core/ui";
import { Screen } from "@nativescript/core/platform";

export class StackLayout extends Common {
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
    let ZeroRotation = CATransform3DRotate(CATransform3DIdentity, 0.0, 0.0, 0.0, 0.0);
    let RotationInYAxis180Deg = CATransform3DRotate(CATransform3DIdentity, (180 * Math.PI) / 180.0, 0.0, 1.0, 0.0);

    setTimeout(() => {
      if (this.isRtl) {
        this.nativeViewProtected.layer.transform = RotationInYAxis180Deg;
        this.nativeViewProtected.layer.rasterizationScale = Screen.mainScreen.scale;
        for (
          let viewIndex = 0;
          viewIndex < this["getChildrenCount"]();
          viewIndex++
        ) {
          let NSView: View = this["getChildAt"](viewIndex);
          let isRtl: boolean = NSView["isRtl"] || false;
          if (isRtl) {
            NSView.nativeView.layer.transform = ZeroRotation;
          } else {
            NSView.nativeView.layer.transform = RotationInYAxis180Deg;
            this.nativeViewProtected.layer.rasterizationScale = Screen.mainScreen.scale;
          }
        }
      } else {
        this.nativeViewProtected.layer.transform = ZeroRotation;
        for (
          let viewIndex = 0;
          viewIndex < this["getChildrenCount"]();
          viewIndex++
        ) {
          let NSView: View = this["getChildAt"](viewIndex);
          NSView.nativeView.layer.transform = ZeroRotation;
        }
      }
    }, 1);
  }
}

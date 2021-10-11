import { Common, isRtlProperty } from "./stack-layout.common";
import { View } from "@nativescript/core/ui";
import { Screen } from "@nativescript/core/platform";

export class StackLayout extends Common {
  public initNativeView(): void {
    super.initNativeView();
    this.scheduleDirectionUpdate();
  }

  [isRtlProperty.setNative](isRtl: boolean): void {
    this.isRtl = isRtl;
    this.scheduleDirectionUpdate();
  }

  public addChild(view: View): void {
    super.addChild(view);
    this.scheduleDirectionUpdate();
  }

  public removeChild(view: View): void {
    super.removeChild(view);
    if (view.nativeViewProtected) {
      this.scheduleDirectionUpdate();
    }
  }

  protected _updateDirection(): void {
    let ZeroRotation = CATransform3DRotate(CATransform3DIdentity, 0.0, 0.0, 0.0, 0.0);
    let RotationInYAxis180Deg = CATransform3DRotate(CATransform3DIdentity, (180 * Math.PI) / 180.0, 0.0, 1.0, 0.0);


    if (this.isRtl) {
      this.nativeViewProtected.layer.transform = RotationInYAxis180Deg;
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
        }
        NSView.nativeViewProtected.layer.rasterizationScale = Screen.mainScreen.scale;
      }
      this.nativeViewProtected.layer.rasterizationScale = Screen.mainScreen.scale;
    } else {
      this.nativeViewProtected.layer.transform = ZeroRotation;
      for (
        let viewIndex = 0;
        viewIndex < this["getChildrenCount"]();
        viewIndex++
      ) {
        let NSView: View = this["getChildAt"](viewIndex);
        NSView.nativeView.layer.transform = ZeroRotation;
        NSView.nativeViewProtected.layer.rasterizationScale = Screen.mainScreen.scale;
      }
    }
  }
}

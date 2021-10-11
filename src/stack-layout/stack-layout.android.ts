import { Common, isRtlProperty, directionProperty } from "./stack-layout.common";
import { View } from "@nativescript/core/ui";

export class StackLayout extends Common {
  public initNativeView(): void {
    super.initNativeView();
    this.scheduleDirectionUpdate();
  }

  [isRtlProperty.setNative](isRtl: boolean): void {
    this.isRtl = isRtl;
    this.scheduleDirectionUpdate();
  }

  [directionProperty.setNative](direction: string) {
    if (direction === "rtl") {
      this.isRtl = true;
    } else if (direction === "ltr") {
      this.isRtl = false;
    }
    this.scheduleDirectionUpdate();
  }

  public addChild(view: View): void {
    super.addChild(view);
    this.scheduleDirectionUpdate();
  }

  public removeChild(view: View): void {
    super.removeChild(view);
    this.scheduleDirectionUpdate();
  }

  protected _updateDirection(): void {
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

  }
}

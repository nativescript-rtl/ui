import { Common, isRtlProperty, directionProperty } from "./grid-layout.common";
import { View } from "@nativescript/core/ui";
export class GridLayout extends Common {
  public initNativeView(): void {
    super.initNativeView();
    this.scheduleDirectionUpdate();
  }

  [isRtlProperty.setNative](isRtl: boolean): void {
    this.isRtl = isRtl;
    this.scheduleDirectionUpdate();
  }

  [directionProperty.setNative](direction: string) {
    console.log("I called!");
    if (direction === "rtl") {
      this.isRtl = true;
    } else if (direction === "ltr") {
      this.isRtl = false;
    }

    this.scheduleDirectionUpdate();
  }

  public addChild(view: View): void {
    super.addChild(view);
    if (view.nativeViewProtected) {
      this.scheduleDirectionUpdate();
    }
  }

  public removeChild(view: View): void {
    super.removeChild(view);
    if (view.nativeViewProtected) {
      this.scheduleDirectionUpdate();
    }
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

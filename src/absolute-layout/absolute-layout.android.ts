import {
  Common,
  isRtlProperty,
  directionProperty
} from "./absolute-layout.common";
import { View } from "@nativescript/core/ui";

export class AbsoluteLayout extends Common {
  public initNativeView(): void {
    super.initNativeView();
    this._updateDirection();
  }

  [isRtlProperty.setNative](isRtl: boolean): void {
    this.isRtl = isRtl;
    this._updateDirection();
  }

  [directionProperty.setNative](direction: string) {
    if (direction === "rtl") {
      this.isRtl = true;
    } else if (direction === "ltr") {
      this.isRtl = false;
    }

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

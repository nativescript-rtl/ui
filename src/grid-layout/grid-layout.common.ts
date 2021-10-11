import { GridLayout } from "@nativescript/core/ui/layouts/grid-layout";
import {
  Property,
  CssProperty,
  Style
} from "@nativescript/core/ui";

export class Common extends GridLayout {
  public isRtl: boolean;
  private _directionScheduled = false;
  scheduleDirectionUpdate() {
    if (this._directionScheduled) {
      return;
    }
    this._directionScheduled = true;
    setTimeout(() => {
      this._directionScheduled = false;
      if (!this.nativeViewProtected) {
        return;
      }
      this._updateDirection();
    });
  }
  protected _updateDirection() {
    // overriden
  };
}

export const isRtlProperty = new Property<Common, boolean>({
  name: "isRtl",
  defaultValue: true,
  valueConverter(v): boolean {
    let lowercase = (v + "").toLowerCase();
    if (lowercase === "true") {
      return true;
    } else if (lowercase === "false") {
      return false;
    }
    throw new Error("Invalid boolean: " + v);
  }
});

isRtlProperty.register(Common);

export const directionProperty = new CssProperty<Style, string>({
  name: "direction",
  cssName: "direction",
  defaultValue: "rtl",
  affectsLayout: true,
  valueConverter: (value: string) => {
    const val = value.toLocaleLowerCase();
    if (val === "rtl" || val === "ltr") {
      return val;
    }
    throw new Error("Invalid string: " + val);
  }
});
directionProperty.register(Style);

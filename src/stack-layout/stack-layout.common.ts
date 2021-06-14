import { StackLayout } from "@nativescript/core/ui/layouts/stack-layout";
import { Property, CssProperty, Style } from "@nativescript/core/ui";

export class Common extends StackLayout {
    public isRtl: boolean;
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
  valueConverter: (value: string) => {
    const val = value.toLocaleLowerCase();
    if (val === "rtl" || val === "ltr") {
      return val;
    }
    throw new Error("Invalid string: " + val);
  }
});
directionProperty.register(Style);

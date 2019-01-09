import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { Property } from "tns-core-modules/ui/core/properties/properties";

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
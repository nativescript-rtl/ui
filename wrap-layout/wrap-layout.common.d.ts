import { WrapLayout } from "@nativescript/core/ui/layouts/wrap-layout";
import { Property, CssProperty, Style } from "@nativescript/core/ui";
export declare class Common extends WrapLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

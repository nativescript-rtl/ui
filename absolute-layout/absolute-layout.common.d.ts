import { AbsoluteLayout } from "@nativescript/core/ui/layouts/absolute-layout";
import { Property, CssProperty, Style } from "@nativescript/core/ui";
export declare class Common extends AbsoluteLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

import { WrapLayout } from "tns-core-modules/ui/layouts/wrap-layout";
import { Property, CssProperty, Style } from "tns-core-modules/ui/core/properties/properties";
export declare class Common extends WrapLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

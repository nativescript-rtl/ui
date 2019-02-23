import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { Property, CssProperty, Style } from "tns-core-modules/ui/core/properties/properties";
export declare class Common extends StackLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

import { StackLayout } from "@nativescript/core/ui/layouts/stack-layout";
import { Property, CssProperty, Style } from "@nativescript/core/ui";
export declare class Common extends StackLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

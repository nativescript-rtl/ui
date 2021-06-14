import { GridLayout } from "@nativescript/core/ui/layouts/grid-layout";
import { Property, CssProperty, Style } from "@nativescript/core/ui";
export declare class Common extends GridLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

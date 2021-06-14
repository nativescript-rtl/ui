import { DockLayout } from "@nativescript/core/ui/layouts/dock-layout";
import { Property, CssProperty, Style } from "@nativescript/core/ui";
export declare class Common extends DockLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

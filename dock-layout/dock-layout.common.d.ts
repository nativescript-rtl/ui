import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout";
import { Property, CssProperty, Style } from "tns-core-modules/ui/core/properties/properties";
export declare class Common extends DockLayout {
    isRtl: boolean;
}
export declare const isRtlProperty: Property<Common, boolean>;
export declare const directionProperty: CssProperty<Style, string>;

import { Common } from "./dock-layout.common";
import { View } from "tns-core-modules/ui/page/page";
export declare class DockLayout extends Common {
    createNativeView(): object;
    addChild(view: View): void;
    removeChild(view: View): void;
}

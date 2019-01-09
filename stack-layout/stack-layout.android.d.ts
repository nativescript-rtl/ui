import { Common } from "./stack-layout.common";
import { View } from "tns-core-modules/ui/page/page";
export declare class StackLayout extends Common {
    createNativeView(): object;
    addChild(view: View): void;
    removeChild(view: View): void;
}

import { Common } from "./stack-layout.common";
import { View } from "tns-core-modules/ui/page/page";
export declare class StackLayout extends Common {
    initNativeView(): void;
    addChild(view: View): void;
    removeChild(view: View): void;
    private _updateDirection;
}

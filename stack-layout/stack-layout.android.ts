import { Common } from "./stack-layout.common";
import { View } from "tns-core-modules/ui/page/page";

export class StackLayout extends Common {
    createNativeView(): object {
        let view: any = super.createNativeView();
        if (this.isRtl) {
            view.setRotationY(180);
            setTimeout(() => {
                for (let viewIndex = 0; viewIndex < this["getChildrenCount"](); viewIndex++) {
                    let NSView: View = this["getChildAt"](viewIndex);
                    let isRtl: boolean = NSView["isRtl"] || false;
                    console.log(NSView.typeName + " - " + isRtl);
                    if (isRtl) {
                        NSView.nativeView.setRotationY(0);
                    } else {
                        NSView.nativeView.setRotationY(180);
                    }
                }
            }, 1);
        }
        return view;
    }
}

# @nativescript-rtl/ui
Add right-to-left UI support to NativeScript framework
## Installation
to install plugin write:
```bash
tns plugin add @nativescript-rtl/ui
```

## Preview
| LTR | Layout | RTL |
| :---         |     :---:      |          ---: |
| <img alt="screenshot 1" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-1.png" width="170"> | `AbsoluteLayout` | <img alt="screenshot 1" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-1.png" width="170"> |
| <img alt="screenshot 2" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-2.png" width="170"> | `DockLayout` | <img alt="screenshot 2" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-2.png" width="170"> |
| <img alt="screenshot 3" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-3.png" width="170"> | `GridLayout` | <img alt="screenshot 3" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-3.png" width="170"> |
| <img alt="screenshot 4" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-4.png" width="170"> | `StackLayout` | <img alt="screenshot 4" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-4.png" width="170"> |
| <img alt="screenshot 5" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-5.png" width="170"> | `WrapLayout` | <img alt="screenshot 5" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-5.png" width="170"> |

## How to use
declare plugin in XML then use it
```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:rtl="@nativescript-rtl/ui">
  <rtl:WrapLayout orientation="horizontal" width="210" height="210" backgroundColor="lightgray">
    <Label text="Label 1" width="70" height="70" backgroundColor="red"/>
    <Label text="Label 2" width="70" height="70" backgroundColor="green"/>
    <Label text="Label 3" width="70" height="70" backgroundColor="blue"/>
    <Label text="Label 4" width="70" height="70" backgroundColor="yellow"/>
  </rtl:WrapLayout>
</Page>
```

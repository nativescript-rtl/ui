import { Observable } from 'tns-core-modules/data/observable';
import { GridLayout } from '@nativescript-rtl/ui';

export class HelloWorldModel extends Observable {
  public message: string;
  private gridLayout: GridLayout;

  constructor() {
    super();

    this.gridLayout = new GridLayout();
  }
}

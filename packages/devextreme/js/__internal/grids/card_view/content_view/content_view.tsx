import { Subscribable, computed } from "@ts/core/reactive";
import { InfernoNode } from "inferno";
import { View } from "../core/view";
import { DataController } from "../data_controller/data_controller";
import { Card } from "./card";

export const CLASSES = {
  content: 'dx-cardview-content',
}

export class ContentView extends View {
  private items = computed((dataItems) => {
    let index = 0;
    return dataItems.map((dataItem) => ({
      index: index++,
    }))
  }, [this.dataController.items]);
  
  static dependencies = [DataController] as const;

  constructor(
    private dataController: DataController,
  ) {
    super();
  }

  protected vdom = computed((items) => {
      return <div className={CLASSES.content}>
        {
          items.map(
            item => <Card index={item.index}></Card>
          )
        }
      </div>
    }, [this.items]) 
}
import { Subscribable, computed } from "@js/__internal/core/reactive";
import { InfernoNode } from "inferno";
import { View } from "../core/view";
import { HeaderPanelController } from "./controller";

export class HeaderPanelView extends View{
  static dependencies = [HeaderPanelController];
  public vdom = computed((items) => {
    return 
  }, [this.controller.items])

  constructor(
    private controller: HeaderPanelController,
  ) {
    super();
  }
}
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import dxScheduler from "devextreme/ui/scheduler";
import type { Properties } from "devextreme/ui/scheduler";
import { wrapDxWithReact } from "../utils";
import { data, resources } from "./data";
import "./form-customization.css";

const Scheduler = wrapDxWithReact<Properties>(dxScheduler);

const meta: Meta<typeof Scheduler> = {
  title: "Components/Scheduler/Form Customization",
  component: Scheduler,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Scheduler>;

const baseConfig: Properties = {
  height: 600,
  views: ["day", "week", "workWeek", "month"],
  currentView: "week",
  startDayHour: 9,
  currentDate: new Date(2021, 3, 29),
  dataSource: data,
};

export const DefaultForm: Story = {
  args: {
    ...baseConfig,
    resources,
  },
};

interface ShowOnlySpecificItemsArgs extends Properties {
  showSubjectGroup?: boolean;
  showDateGroup?: boolean;
  showDescriptionGroup?: boolean;
  showResourcesGroup?: boolean;
  showRecurrenceGroup?: boolean;
}

export const ShowOnlySpecificItems: Story = {
  args: {
    showSubjectGroup: true,
    showDateGroup: true,
    showRecurrenceGroup: false,
    showDescriptionGroup: false,
    showResourcesGroup: true,
    ...baseConfig,
    resources,
  } as ShowOnlySpecificItemsArgs,
  argTypes: {
    showSubjectGroup: {
      control: "boolean",
    },
    showDateGroup: {
      control: "boolean",
    },
    showRecurrenceGroup: {
      control: "boolean",
    },
    showDescriptionGroup: {
      control: "boolean",
    },
    showResourcesGroup: {
      control: "boolean",
    },
  } as Record<string, unknown>,
  render: (args: ShowOnlySpecificItemsArgs) => {
    const items: unknown[] = [];
    if (args.showSubjectGroup) items.push("subjectGroup");
    if (args.showDateGroup) items.push("dateGroup");
    if (args.showDescriptionGroup) items.push("descriptionGroup");
    if (args.showResourcesGroup) items.push("resourcesGroup");
    if (args.showRecurrenceGroup) items.push("recurrenceGroup");

    return (
      <Scheduler
        {...baseConfig}
        resources={resources}
        editing={{ form: { items } } as Properties['editing']}
      />
    );
  },
};

const positions = [1, 2, 3, 4, 5];

interface ReorderItemsArgs extends Properties {
  subjectGroupPosition: number;
  dateGroupPosition: number;
  descriptionGroupPosition: number;
  resourcesGroupPosition: number;
  recurrenceGroupPosition: number;
}

export const ReorderItems: Story = {
  args: {
    subjectGroupPosition: 3,
    dateGroupPosition: 2,
    descriptionGroupPosition: 1,
    resourcesGroupPosition: 4,
    recurrenceGroupPosition: 5,
    ...baseConfig,
    resources,
  } as ReorderItemsArgs,
  argTypes: {
    subjectGroupPosition: {
      control: { type: "select" },
      options: positions,
    },
    dateGroupPosition: {
      control: { type: "select" },
      options: positions,
    },
    descriptionGroupPosition: {
      control: { type: "select" },
      options: positions,
    },
    resourcesGroupPosition: {
      control: { type: "select" },
      options: positions,
    },
    recurrenceGroupPosition: {
      control: { type: "select" },
      options: positions,
    },
  } as Record<string, unknown>,
  render: (args: ReorderItemsArgs) => {
    const groups = [
      { name: "subjectGroup", position: args.subjectGroupPosition },
      { name: "dateGroup", position: args.dateGroupPosition },
      { name: "descriptionGroup", position: args.descriptionGroupPosition },
      { name: "resourcesGroup", position: args.resourcesGroupPosition },
      { name: "recurrenceGroup", position: args.recurrenceGroupPosition },
    ];

    groups.sort((a, b) => a.position - b.position);
    const items: unknown[] = groups.map(g => g.name);

    return (
      <Scheduler
        {...baseConfig}
        resources={resources}
        editing={{ form: { items } } as Properties['editing']}
      />
    );
  },
};

export const AddCustomItems: Story = {
  args: {
    ...baseConfig,
    resources,
    editing: {
      form: {
        items: [
          "subjectGroup",
          "dateGroup",
          {
            name: "likeGroup",
            itemType: "group",
            caption: "Feedback",
            items: [
              {
                name: "commentIcon",
                template: () => {
                  const element = document.createElement("div");
                  element.classList.add("dx-icon", "dx-icon-comment");
                  return element;
                },
              },
              {
                itemType: "simple",
                editorType: "dxTextArea",
                name: "comments",
                editorOptions: {
                  placeholder: "Your comments...",
                  height: 100
                }
              },
              {
                name: "likeButton",
                itemType: "button",
                buttonOptions: {
                  icon: "like",
                  type: "success",
                  text: "Like",
                  onClick: () => {
                    alert("You liked this appointment!");
                  },
                },
              },
            ],
          },
        ],
      }
    },
  } as Record<string, unknown>,
};

export const CustomizeExistingItems: Story = {
  args: {
    ...baseConfig,
    resources,
    editing: {
      form: {
        items: [
          {
            name: "subjectGroup",
            items: [
              {
                name: "subjectIcon",
                itemType: "button",
                buttonOptions: {
                  elementAttr: { id: 'customize-subjectIcon', class: "scheduler-form-custom-icon-button" },
                  icon: "floppy",
                  stylingMode: "text",
                  onClick: () => {
                    alert("Subject icon clicked!");
                  },
                },
              },
              {
                name: "subject",
                label: { text: "Event Title" },
                editorOptions: {
                  placeholder: "Enter event title..."
                }
              },
            ],
          },
          {
            name: "dateGroup",
            items: [
              {
                name: "startDate",
                label: { text: "From" },
                editorOptions: {
                  width: "100%"
                }
              },
              {
                name: "endDate",
                label: { text: "To" },
                editorOptions: {
                  width: "100%"
                }
              },
              {
                colSpan: 2,
                name: "allDay",
                label: { text: "All day event" }
              },
            ],
          },
          {
            name: "descriptionGroup",
            items: [
              {
                colSpan: 2,
                name: "description",
                label: { text: "Notes" },
                editorOptions: {
                  height: 120,
                  placeholder: "Add notes about this event..."
                }
              }
            ]
          },
        ],
      },
    },
  } as Record<string, unknown>,
};

export const RTL: Story = {
  args: {
    ...baseConfig,
    resources,
    rtlEnabled: true,
  },
};

export const LegacyPopup: Story = {
  args: {
    ...baseConfig,
    resources,
    editing: {
      legacyForm: true,
    },
  } as Record<string, unknown>,
};

interface IconsShowModeArgs extends Properties {
  "editing.form.iconsShowMode"?: "both" | "main" | "recurrence" | "never";
}

export const IconsShowMode: Story = {
  args: {
    ...baseConfig,
    resources,
    editing: {
      form: {
        iconsShowMode: "main",
      },
    },
  } as IconsShowModeArgs,
  argTypes: {
    editing: {
      form: {
        iconsShowMode: {
          control: "radio",
          options: ["both", "main", "recurrence", "never"],
        },
      },
    },
  } as Record<string, unknown>,
};

interface ResourceGroupColSpanArgs extends Properties {
  resourceGroupColSpan?: number;
}

export const ResourceGroupColSpan: Story = {
  args: {
    ...baseConfig,
    resources,
    resourceGroupColSpan: 1,
  } as ResourceGroupColSpanArgs,
  argTypes: {
    resourceGroupColSpan: {
      control: { type: "select" },
      options: [1, 2, 3],
    },
  } as Record<string, unknown>,
  render: (args: ResourceGroupColSpanArgs) => {
    const items: unknown[] = [
      "subjectGroup",
      "dateGroup",
      {
        name: "resourcesGroup",
        colSpan: args.resourceGroupColSpan ?? 1,
      },
      "descriptionGroup",
    ];

    return (
      <Scheduler
        {...baseConfig}
        resources={resources}
        editing={{ form: { items } } as Properties['editing']}
      />
    );
  },
};

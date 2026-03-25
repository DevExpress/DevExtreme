import type { Meta, StoryObj } from "@storybook/react-webpack5";
import React, { useRef } from "react";
import dxScheduler from "devextreme/ui/scheduler";
import type { Properties } from "devextreme/ui/scheduler";
import { wrapDxWithReact } from "../utils";
import { data, resources } from "./data";
import "./form-customization.css";

const Scheduler = wrapDxWithReact<Properties>(dxScheduler);

import ReactScheduler from 'devextreme-react/scheduler';
import dxForm from "devextreme/ui/form";

const iconsShowModeArgType = {
  "editing.form.iconsShowMode": {
    control: "radio",
    options: ["both", "main", "recurrence", "none"],
  },
} as Record<string, unknown>;

const meta: Meta<typeof Scheduler> = {
  title: "Components/Scheduler/Form Customization",
  component: Scheduler,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Scheduler>;

const baseConfig = {
  height: 600,
  views: ["day", "week", "workWeek", "month"],
  currentView: "week",
  startDayHour: 9,
  currentDate: new Date(2021, 3, 29),
  dataSource: data,
  "editing.form.iconsShowMode": "main",
} as Properties;

export const DefaultForm: Story = {
  args: {
    ...baseConfig,
    resources,
  },
  argTypes: iconsShowModeArgType,
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
    ...iconsShowModeArgType,
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
        editing={{
          form: {
            items,
            iconsShowMode: args["editing.form.iconsShowMode"]
          }
        } as Properties['editing']}
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
    ...iconsShowModeArgType,
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
        editing={{
          form: {
            items,
            iconsShowMode: args["editing.form.iconsShowMode"]
          }
        } as Properties['editing']}
      />
    );
  },
};

export const AddCustomItems: Story = {
  args: {
    ...baseConfig,
    resources,
  },
  argTypes: iconsShowModeArgType,
  render: (args) => {
    return (
      <Scheduler
        {...baseConfig}
        resources={resources}
        editing={{
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
            iconsShowMode: args["editing.form.iconsShowMode"]
          }
        } as Properties['editing']}
      />
    );
  },
};

export const CustomizeExistingItems: Story = {
  args: {
    ...baseConfig,
    resources,
  },
  argTypes: iconsShowModeArgType,
  render: (args) => {
    return (
      <Scheduler
        {...baseConfig}
        resources={resources}
        editing={{
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
            iconsShowMode: args["editing.form.iconsShowMode"]
          },
        } as Properties['editing']}
      />
    );
  },
};

interface ResourcesColumnLayoutArgs extends Properties {
  resourcesColCount: number;
}

export const ResourcesColumnLayout: Story = {
  args: {
    resourcesColCount: 2,
    ...baseConfig,
    resources,
  } as ResourcesColumnLayoutArgs,
  argTypes: {
    resourcesColCount: {
      control: { type: "select" },
      options: [1, 2, 3],
    },
    ...iconsShowModeArgType,
  } as Record<string, unknown>,
  render: (args: ResourcesColumnLayoutArgs) => {
    return (
      <Scheduler
        {...baseConfig}
        resources={resources}
        editing={
          {
            form: {
              items: [
                {
                  name: "mainGroup",
                  items: [
                    "subjectGroup",
                    "dateGroup",
                    "repeatGroup",
                    {
                      name: "resourcesGroup",
                      items: [
                        "resourcesGroupIcon",
                        {
                          name: "resourcesGroupContent",
                          colCount: args.resourcesColCount,
                          items: [
                            "roomId",
                            "priorityId",
                            { name: "assigneeId", colSpan: 2 },
                          ],
                        },
                      ],
                    },
                    "descriptionGroup",
                  ],
                },
              ],
              iconsShowMode: args["editing.form.iconsShowMode"],
            },
          } as Properties["editing"]
        }
      />
    );
  },
};

export const CustomItemBeforeMainGroup: Story = {
  args: {
    ...baseConfig,
    resources,
  },
  argTypes: iconsShowModeArgType,
  render: (args) => {
    return (
      <Scheduler
        {...baseConfig}
        resources={resources}
        editing={{
          form: {
            items: [
              {
                name: "customNotice",
                template: () => {
                  const element = document.createElement("div");
                  element.className = "custom-form-notice";
                  element.textContent = "This is a custom element placed before mainGroup. The slide animation should not overlap this area.";
                  return element;
                },
              },
              "mainGroup",
              "recurrenceGroup",
            ],
            iconsShowMode: args["editing.form.iconsShowMode"],
          },
        } as Properties["editing"]}
      />
    );
  },
};

export const RTL: Story = {
  args: {
    ...baseConfig,
    resources,
    rtlEnabled: true,
  },
  argTypes: iconsShowModeArgType,
};

export const LegacyPopup: Story = {
  args: {
    ...baseConfig,
    "editing.form.iconsShowMode": "both",
  } as Properties,
  argTypes: iconsShowModeArgType,
  render: (args) => {
    let form: InstanceType<typeof dxForm> | null = null;

    const schedulerRef = useRef(null);

    return (
      // @ts-ignore
      <ReactScheduler
        ref={schedulerRef}
        {...baseConfig}
        onAppointmentUpdating={(e) => {
          delete e.newData.repeat;
        }}
        onAppointmentAdding={(e) => {
          delete e.appointmentData.repeat;
        }}
        editing={{
          popup: {
            maxWidth: 800,
            toolbarItems: [
              {
                toolbar: 'top',
                location: 'before',
                text: "Edit Appointment",
                cssClass: 'dx-toolbar-label',
              },
              {
                toolbar: 'top',
                location: 'after',
                options: {
                  stylingMode: 'contained',
                  type: 'default',
                  onClick: () => {
                    // @ts-ignore
                    schedulerRef.current?.instance()?.hideAppointmentPopup(true);
                  },
                  text: 'Save',
                },
                shortcut: 'done',
              },
              {
                toolbar: 'top',
                location: 'after',
                shortcut: 'cancel',
              },
            ],
          },
          form: {
            onInitialized: function (e) {
              e.component?.on('fieldDataChanged', (e) => {
                if (e.dataField === 'recurrenceRule') {
                  form?.option('formData.repeat', !!e.value)
                }
              });
            },
            onContentReady: function (e) {
              form = e.component;
            },
            iconsShowMode: args["editing.form.iconsShowMode"],
            items: [
              {
                name: "mainGroup",
                cssClass: "",
                items: [
                  "subjectGroup",
                  "dateGroup",
                  {
                    name: "repeatGroup",
                    items: [
                      "repeatIcon",
                      {
                        name: "customRepeatEditor",
                        editorType: "dxSwitch",
                        dataField: "repeat",
                        editorOptions: {
                          onValueChanged: (e) => {
                            if (e.value) {
                              const recurrenceRule = form?.option('formData')?.recurrenceRule;

                              form?.option("colCount", 2);
                              form?.option('formData.recurrenceRule', recurrenceRule || "FREQ=DAILY");
                              form?.itemOption("recurrenceGroup", "visible", true);
                            } else {
                              form?.option("colCount", 1);
                              form?.option('formData.recurrenceRule', "");
                              form?.itemOption("recurrenceGroup", "visible", false);
                            }
                          },
                        },
                      },
                    ],
                  },
                  "resourcesGroup",
                  "descriptionGroup",
                ],
              },
              {
                name: "recurrenceGroup",
                itemType: "group",
                cssClass: "",
                visible: false,
                items: [
                  "recurrenceRuleGroup",
                  "recurrenceEndGroup",
                ],
              },
            ],
          },
        } as Properties['editing']}
      />
    );
  },
};

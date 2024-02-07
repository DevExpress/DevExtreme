import React, { useCallback, useRef } from 'react';
import Diagram, {
  CustomShape, Nodes, AutoLayout, ContextToolbox, Toolbox, PropertiesPanel, Group, DiagramTypes,
} from 'devextreme-react/diagram';
import notify from 'devextreme/ui/notify';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.ts';

const shapes = ['team', 'employee'];

const orgItemsDataSource = new ArrayStore({
  key: 'ID',
  data: service.getOrgItems(),
});

function showToast(text: string) {
  notify({
    position: {
      at: 'top', my: 'top', of: '#diagram', offset: '0 4',
    },
    message: text,
    type: 'warning',
    delayTime: 2000,
  });
}

function onRequestLayoutUpdate(e: DiagramTypes.RequestLayoutUpdateEvent) {
  for (let i = 0; i < e.changes.length; i += 1) {
    if (e.changes[i].type === 'remove') {
      e.allowed = true;
    } else if (e.changes[i].data.ParentID !== undefined && e.changes[i].data.ParentID !== null) {
      e.allowed = true;
    }
  }
}

function itemStyleExpr(obj: { Type: string; }) {
  if (obj.Type === 'root') {
    return { fill: '#ffcfc3' };
  }

  if (obj.Type === 'team') {
    return { fill: '#b7e3fe' };
  }

  return { fill: '#bbefcb' };
}

export default function App() {
  const diagramRef = useRef(null);

  const onRequestEditOperation = useCallback((e) => {
    const diagram = diagramRef.current.instance;
    if (e.operation === 'addShape') {
      if (e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
        if (e.reason !== 'checkUIElementAvailability') {
          showToast('You can add only a \'Team\' or \'Employee\' shape.');
        }
        e.allowed = false;
      }
    } else if (e.operation === 'deleteShape') {
      if (e.args.shape.type === 'root') {
        if (e.reason !== 'checkUIElementAvailability') {
          showToast('You cannot delete the \'Development\' shape.');
        }
        e.allowed = false;
      }
      if (e.args.shape.type === 'team') {
        for (let i = 0; i < e.args.shape.attachedConnectorIds.length; i += 1) {
          if (diagram.getItemById(e.args.shape.attachedConnectorIds[i]).toId !== e.args.shape.id) {
            if (e.reason !== 'checkUIElementAvailability') {
              showToast('You cannot delete a \'Team\' shape that has a child shape.');
            }
            e.allowed = false;
            break;
          }
        }
      }
    } else if (e.operation === 'resizeShape') {
      if (e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
        if (e.reason !== 'checkUIElementAvailability') {
          showToast('The shape size is too small.');
        }
        e.allowed = false;
      }
    } else if (e.operation === 'changeConnection') {
      const shapeType = e.args.newShape && e.args.newShape.type;
      if (shapeType === 'root' && e.args.connectorPosition === 'end') {
        if (e.reason !== 'checkUIElementAvailability') {
          showToast('The \'Development\' shape cannot have an incoming connection.');
        }
        e.allowed = false;
      }
      if (shapeType === 'employee' && e.args.connectorPosition === 'start') {
        e.allowed = false;
      }
    } else if (e.operation === 'changeConnectorPoints') {
      if (e.args.newPoints.length > 2) {
        if (e.reason !== 'checkUIElementAvailability') {
          showToast('You cannot add points to a connector.');
        }
        e.allowed = false;
      }
    } else if (e.operation === 'beforeChangeShapeText') {
      if (e.args.shape.type === 'root') {
        if (e.reason !== 'checkUIElementAvailability') {
          showToast('You cannot change the \'Development\' shape\'s text.');
        }
        e.allowed = false;
      }
    } else if (e.operation === 'changeShapeText') {
      if (e.args.text === '') {
        if (e.reason !== 'checkUIElementAvailability') {
          showToast('A shape text cannot be empty.');
        }
        e.allowed = false;
      }
    } else if (e.operation === 'beforeChangeConnectorText') {
      e.allowed = false;
    }
  }, []);

  return (
    <Diagram
      id="diagram"
      ref={diagramRef}
      onRequestEditOperation={onRequestEditOperation}
      onRequestLayoutUpdate={onRequestLayoutUpdate}
    >
      <CustomShape
        category="items"
        type="root"
        baseType="octagon"
        defaultText="Development"
      />
      <CustomShape
        category="items"
        type="team"
        baseType="ellipse"
        title="Team"
        defaultText="Team Name"
      />
      <CustomShape
        category="items"
        type="employee"
        baseType="rectangle"
        title="Employee"
        defaultText="Employee Name"
      />
      <Nodes
        dataSource={orgItemsDataSource}
        keyExpr="ID"
        textExpr="Name"
        typeExpr="Type"
        parentKeyExpr="ParentID"
        styleExpr={itemStyleExpr}
      >
        <AutoLayout type="tree" />
      </Nodes>
      <ContextToolbox shapeIconsPerRow={2} width={100} shapes={shapes as any}>
      </ContextToolbox>
      <Toolbox shapeIconsPerRow={2}>
        <Group title="Items" shapes={shapes as any} />
      </Toolbox>
      <PropertiesPanel visibility="disabled">
      </PropertiesPanel>
    </Diagram>
  );
}

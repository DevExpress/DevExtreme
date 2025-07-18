import javascript

from MethodCallExpr c, VarRef v
where
  c.getReceiver() = v 
  and v.getVariable().getName() = "eventsEngine" 
  and c.getMethodName() = "on"
  and c.getFile().getAbsolutePath() = "/Users/pomah/Work/DevExpress/DevExtreme/25_2/packages/devextreme/js/__internal/events/m_dblclick.ts"
select c

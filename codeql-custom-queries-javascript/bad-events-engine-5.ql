import javascript
import DataFlow

SourceNode eventsEngine(TypeTracker t) {
  t.start() and
  (
    result = moduleImport("@js/common/core/events/core/events_engine").getAPropertyRead("default")
  )
  or
  exists(TypeTracker t2 |
    result = eventsEngine(t2).track(t2, t)
  )
}

SourceNode eventsEngine() {
  result = eventsEngine(TypeTracker::end())
}

CallNode eventsEngineSubscription(TypeTracker t) {
  t.start()
    and result = eventsEngine().getAMemberCall("on")
    and isString(result.getArgument(2).asExpr().getType())
  or
  exists(TypeTracker t2 |
    result = eventsEngineSubscription(t2).track(t2, t)
  )
}

SourceNode eventsEngineSubscription() {
  result = eventsEngineSubscription(TypeTracker::end())
}

predicate contains(AstNode a, AstNode b) {
  a.getAChild() = b or exists(AstNode child | child = a.getAChild() and contains(child, b) and not child instanceof Function)
}

predicate isGoodSubscription(Function f) {
  exists(CallExpr cs |
    cs.getCalleeName() = "isElementInCurrentGrid" and
    contains(f.getBody(), cs)
  )
}
SourceNode goodSubscription(TypeTracker t) {
  t.start() and (
    exists (FunctionNode f |
      isGoodSubscription(f.asExpr())
      and result = f
    )
    or
    exists(FunctionNode f, CallNode cs | 
      cs.getCalleeName() = "createAction"
      and cs.getArgument(0) = f
      and isGoodSubscription(f.asExpr())
      and result = cs
    )
  )
  or
  exists(TypeTracker t2 |
    result = goodSubscription(t2).track(t2, t)
  )
}

SourceNode goodSubscription() {
  result = goodSubscription(TypeTracker::end())
}

predicate isString(Type t) {
  t.getKind() = 1 or t.getKind() = 22
}

from CallNode s
where
  s = eventsEngineSubscription()
  and
  not exists(SourceNode ss | ss = goodSubscription() | s.getLastArgument() = ss)
select s

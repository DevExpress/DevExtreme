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
    and result.getArgument(2).asExpr().getType().toString() = "string"
  or
  exists(TypeTracker t2 |
    result = eventsEngineSubscription(t2).track(t2, t)
  )
}

SourceNode eventsEngineSubscription() {
  result = eventsEngineSubscription(TypeTracker::end())
}


from SourceNode s
where
  s = eventsEngineSubscription() 
select s

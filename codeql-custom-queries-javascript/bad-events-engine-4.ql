import javascript
import DataFlow

predicate contains(AstNode a, AstNode b) {
  a.getAChild() = b or exists(AstNode child | child = a.getAChild() and contains(child, b) and not child instanceof Function)
}

from CallExpr cs, Function f
where
  cs.getCalleeName() = "isElementInCurrentGrid"
  and contains(f.getBody(), cs)
select f

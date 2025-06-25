import { BehaviorSubject } from 'rxjs';

export class ChildRegistry<T> {
  private children: T[] = [];
  private childrenSubject = new BehaviorSubject<T[]>([]);

  public children$ = this.childrenSubject.asObservable();

  register(child: T): void {
    this.children.push(child);
    this.childrenSubject.next([...this.children]);
  }

  unregister(child: T): void {
    this.children = this.children.filter(c => c !== child);
    this.childrenSubject.next([...this.children]);
  }

  getChildren(): T[] {
    return [...this.children];
  }

  clear(): void {
    this.children = [];
    this.childrenSubject.next([]);
  }
}
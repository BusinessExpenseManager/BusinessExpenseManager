import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Directive({
  standalone: true,
  selector: '[appPreventDoubleClick]'
})
export class PreventDoubleClick implements OnInit, OnDestroy {
  @Input()
  debounceTime = 1000;

  @Output()
  debounceClick = new EventEmitter();

  private clicks = new Subject();
  private subscription?: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks
      .pipe(
        debounceTime(this.debounceTime)
      )
      .subscribe(e => this.debounceClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  providers: [
    /* {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    }, */
    {
      provide: MatFormFieldControl,
      useExisting: CustomSelectComponent,
    },
  ],
})
export class CustomSelectComponent
  implements
    ControlValueAccessor,
    OnInit,
    OnDestroy,
    MatFormFieldControl<any>,
    OnChanges
{
  static NextId = 0;
  @Input() keyName!: string;
  @Input() valueName!: string;
  @Input() options: any[] = [];
  private _placeholder!: string;
  private _value!: any;
  overlayOpened = false;
  selectedOptionSub$ = new Subject<any>();
  selectedValue: string = '';
  destroySub$ = new Subject<void>();
  private _onChange!: Function;
  private _onTouch!: Function;

  stateChanges: Subject<void> = new Subject<void>();
  @HostBinding() id: string = `custom-select-${++CustomSelectComponent.NextId}`;
  focused: boolean = false;
  touched: boolean = false;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  controlType: string = 'custom-select';
  autofilled!: boolean;
  @Input('aria-describedby') userAriaDescribedBy?: string = '';
  @Output() selectionChange = new EventEmitter<void>();

  constructor(
    @Optional() @Self() readonly ngControl: NgControl,
    private readonly fm: FocusMonitor,
    private readonly elRef: ElementRef
  ) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
    this.fm.monitor(this.elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  @Input() get placeholder() {
    return this._placeholder;
  }

  set placeholder(val: string) {
    this._placeholder = val;
    this.stateChanges.next();
  }

  get errorState() {
    return !!this.ngControl.invalid && this.touched;
  }

  get empty() {
    return !!this.selectedValue;
  }

  @HostBinding('class.floating') get shouldLabelFloat() {
    return this.empty || this.focused
  }

  get value() {
    return this._value;
  }

  @Input() set value(value: any) {
    this.selectedOptionSub$.next(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stateChanges.next();
  }

  ngOnInit() {
    this.selectedOptionSub$.subscribe((option) => {
      this.selectedValue = option?.[this.valueName] || '';
      this._onChange(option);
      this.stateChanges.next();
      this._onTouch(true);
    });
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this.elRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.stateChanges.next();
    }
  }

  onOptionSelectionChange(change: MatOptionSelectionChange<any>) {
    this.selectedOptionSub$.next(change.source.value);
    this.overlayOpened = false;
    this.selectionChange.emit(change.source.value);
  }

  writeValue(obj: any): void {
    this.selectedOptionSub$.next(obj);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]): void {
    const controlEl = this.elRef.nativeElement.querySelector(".custom-select-container");
    controlEl?.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(event: MouseEvent): void {
    //console.log('click', event)
  }

  ngOnDestroy(): void {
    this.selectedOptionSub$.complete();
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  close() {
    this.value = '';
    this._onChange('');
    this.focused = false;
    this.stateChanges.next();
  }

  toggleOverlay() {
    this.overlayOpened = !this.overlayOpened;
  }
}

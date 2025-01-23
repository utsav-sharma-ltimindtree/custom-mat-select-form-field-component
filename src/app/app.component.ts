import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'demo-angular-13';
  form!: FormGroup;
  options = [
    { id: 1, val: 'Apple' },
    { id: 2, val: 'Orange' },
    { id: 3, val: 'Banana' },
    { id: 4, val: 'Lichi' },
    { id: 5, val: 'DragonFruit' },
    { id: 6, val: 'Grapes' },
  ];

  @ViewChild(MatSelect) matSelect!: MatSelect;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      title: [''],
      option: [''],
    });
  }

  submitForm() {
    console.log(this.form.value);
  }

  onCustomSelectionChange(val: any) {
    console.log('custom - ', val);
  }

  onOptionSelectionChange(change: MatSelectChange) {
    console.log('mat-select-change - ', change);
  }
}

import { NgModule } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { CustomSelectComponent } from './custom-select.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [MatOptionModule, OverlayModule, MatInputModule, CommonModule, MatIconModule, MatButtonModule],
  declarations: [CustomSelectComponent],
  exports: [CustomSelectComponent]
})
export class CustomSelectModule {}

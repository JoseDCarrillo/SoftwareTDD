import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EditorRoutingModule, 
    DashboardComponent 
  ]
})
export class EditorModule { }

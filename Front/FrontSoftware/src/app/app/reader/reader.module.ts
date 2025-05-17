import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderRoutingModule } from './reader-routing.module';
import { DashboardComponent } from '../admin/pages/dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    ReaderRoutingModule,
    DashboardComponent  
  ]
})
export class ReaderModule { }
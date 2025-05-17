import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule, 
    DashboardComponent 
  ]
})
export class AdminModule { }
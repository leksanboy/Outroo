import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
	MatButtonModule, 
	MatButtonToggleModule, 
	MatProgressSpinnerModule, 
	MatInputModule,
	MatTooltipModule, 
	MatMenuModule
} from '@angular/material';

import { FollowingComponent } from './following.component';

const routes: Routes = [
	{
		path: '',
		component: FollowingComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatInputModule,
		MatTooltipModule, 
		MatMenuModule
	],
	declarations: [
		FollowingComponent
	]
})
export class FollowingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatButtonModule, 
	MatButtonToggleModule, 
	MatProgressSpinnerModule, 
	MatTooltipModule,
	MatRippleModule
} from '@angular/material';

import { NewPublicationAddAudiosComponent } from './addAudios.component';

const routes: Routes = [
	{
		path: '',
		component: NewPublicationAddAudiosComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule
	],
	declarations: [
		NewPublicationAddAudiosComponent
	]
})
export class NewPublicationAddPhotosModule { }

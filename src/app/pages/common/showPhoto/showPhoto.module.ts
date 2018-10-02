import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatButtonModule, 
	MatButtonToggleModule, 
	MatProgressSpinnerModule, 
	MatTooltipModule,
	MatRippleModule,
	MatMenuModule
} from '@angular/material';

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { ShowPhotoComponent } from './showPhoto.component';

const routes: Routes = [
	{
		path: '',
		component: ShowPhotoComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatRippleModule,
		MatMenuModule
	],
	declarations: [
		ShowPhotoComponent
	]
})
export class ShowPhotoModule { }

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
	MatMenuModule,
	MatTabsModule,
	MatDialogModule
} from '@angular/material';

import { PipesModule } from '../../../../app/core/pipes/pipes.module';

import { SwiperModule } from 'angular2-useful-swiper';

import { HomeComponent } from './home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		SwiperModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatInputModule,
		MatTooltipModule, 
		MatMenuModule,
		MatTabsModule,
		MatDialogModule
	],
	declarations: [
		HomeComponent
	]
})
export class HomeModule { }

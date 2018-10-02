import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatButtonModule, 
	MatButtonToggleModule, 
	MatProgressSpinnerModule, 
	MatTooltipModule,
	MatRippleModule,
	MatMenuModule,
	MatInputModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { NewPublicationComponent } from './newPublication.component';

const routes: Routes = [
	{
		path: '',
		component: NewPublicationComponent
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
		MatMenuModule,
		MatInputModule
	],
	declarations: [
		NewPublicationComponent
	]
})
export class NewPublicationModule { }

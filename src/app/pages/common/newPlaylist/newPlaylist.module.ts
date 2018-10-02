import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
	MatButtonModule, 
	MatButtonToggleModule, 
	MatProgressSpinnerModule, 
	MatTooltipModule,
	MatRippleModule,
	MatInputModule
} from '@angular/material';

import { NewPlaylistComponent } from './newPlaylist.component';

const routes: Routes = [
	{
		path: '',
		component: NewPlaylistComponent
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
		MatTooltipModule,
		MatRippleModule,
		MatInputModule
	],
	declarations: [
		NewPlaylistComponent
	]
})
export class NewPlaylistModule { }

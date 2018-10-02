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
	MatDialogModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { PhotosComponent } from './photos.component';

// Entry
import { ShowPhotoComponent } from '../../../../app/pages/common/showPhoto/showPhoto.component';

const routes: Routes = [
	{
		path: '',
		component: PhotosComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatInputModule,
		MatTooltipModule, 
		MatMenuModule,
		MatDialogModule
	],
	declarations: [
		PhotosComponent
	],
	entryComponents: [
		ShowPhotoComponent
	]
})
export class PhotosModule { }

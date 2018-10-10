import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatInputModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatTabsModule,
	MatTooltipModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { NotificationsComponent } from './notifications.component';

// Entry
import { ShowPhotoComponent } from '../../../../app/pages/common/showPhoto/showPhoto.component';
import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

const routes: Routes = [
	{
		path: '',
		component: NotificationsComponent
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
		MatDialogModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MatTooltipModule
	],
	declarations: [
		NotificationsComponent
	],
	entryComponents: [
		ShowPhotoComponent,
		ShowPublicationComponent
	]
})
export class NotificationsModule { }

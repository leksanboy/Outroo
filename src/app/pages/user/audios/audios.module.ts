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

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { AudiosComponent } from './audios.component';

// Entry
import { NewPlaylistComponent } from '../../../../app/pages/common/newPlaylist/newPlaylist.component';
import { ShowPlaylistComponent } from '../../../../app/pages/common/showPlaylist/showPlaylist.component';

const routes: Routes = [
	{
		path: '',
		component: AudiosComponent
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
		MatTabsModule,
		MatDialogModule
	],
	declarations: [
		AudiosComponent
	],
	entryComponents: [
		NewPlaylistComponent,
		ShowPlaylistComponent
	]
})
export class AudiosModule { }

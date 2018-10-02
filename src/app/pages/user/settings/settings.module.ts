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
	MatSelectModule,
	MatSlideToggleModule,
	MatDialogModule
} from '@angular/material';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Main
import { SettingsComponent } from './settings.component';

// Entry
import { NewAvatarComponent } from '../../../../app/pages/common/newAvatar/newAvatar.component';
import { NewSessionComponent } from '../../../../app/pages/common/newSession/newSession.component';

const routes: Routes = [
	{
		path: '',
		component: SettingsComponent
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
		MatSelectModule,
		MatSlideToggleModule,
		MatDialogModule
	],
	declarations: [
		SettingsComponent
	],
	entryComponents: [
		NewAvatarComponent,
		NewSessionComponent
	]
})
export class SettingsModule { }

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
	MatSelectModule,
	MatSlideToggleModule,
	MatTabsModule,
	MatTooltipModule
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
		MatDialogModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatTabsModule,
		MatTooltipModule
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

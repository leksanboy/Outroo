import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { 
	MatAutocompleteModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatBottomSheetModule,
	MatDialogModule,
	MatExpansionModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipe
import { PipesModule } from '../../../../app/core/pipes/pipes.module';

// Extra
import { SwiperModule } from 'angular2-useful-swiper';

// Main
import { MainComponent } from './main.component';

// Entry
import { NewPublicationComponent } from '../../../../app/pages/common/newPublication/newPublication.component';
import { NewPublicationAddPhotosComponent } from '../../../../app/pages/common/newPublication/addPhotos/addPhotos.component';
import { NewPublicationAddAudiosComponent } from '../../../../app/pages/common/newPublication/addAudios/addAudios.component';
import { ShowAvatarComponent } from '../../../../app/pages/common/showAvatar/showAvatar.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent
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
		MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatBottomSheetModule,
		MatDialogModule,
		MatExpansionModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule
	],
	declarations: [
		MainComponent
	],
	entryComponents: [
		NewPublicationComponent,
		NewPublicationAddPhotosComponent,
		NewPublicationAddAudiosComponent,
		ShowAvatarComponent
	]
})
export class MainModule { }

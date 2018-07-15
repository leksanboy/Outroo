import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatAutocompleteModule,
	MatBadgeModule,
	MatBottomSheetModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatExpansionModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

import { PagesRouting, routableComponents } from './pages.routing';
import { PagesComponent } from './pages.component';

import { TimeagoPipe } from '../core/pipes/timeago.pipe';
import { ReversePipe } from '../core/pipes/reverse.pipe';
import { SafeHtmlPipe } from '../core/pipes/safehtml.pipe';

import { SwiperModule } from 'angular2-useful-swiper';

import { UserDataService } from '../core/services/user/userData.service';
import { AudioDataService } from '../core/services/user/audioData.service';
import { PhotoDataService } from '../core/services/user/photoData.service';
import { FollowsDataService } from '../core/services/user/followsData.service';
import { PublicationsDataService } from '../core/services/user/publicationsData.service';
import { NotificationsDataService } from '../core/services/user/notificationsData.service';
import { ChatDataService } from '../core/services/user/chatData.service';

import { SessionService } from '../core/services/session/session.service';
import { PlayerService } from '../core/services/player/player.service';
import { MetaService } from '../core/services/meta/meta.service';
import { HeadersService } from '../core/services/headers/headers.service';

// import { WebsocketService } from '../core/services/websocket/websocket.service';
// import { ChatsocketService } from '../core/services/websocket/chat.service';

import { NewReportComponent } from '../pages/common/newReport/newReport.component';
import { SessionPanelMobileComponent } from '../core/services/sessionPanelMobile/sessionPanelMobile.component';

import { NewPublicationComponent } from './common/newPublication/newPublication.component';
import { NewPublicationAddPhotosComponent } from './common/newPublication/addPhotos/addPhotos.component';
import { NewPublicationAddAudiosComponent } from './common/newPublication/addAudios/addAudios.component';
import { ShowAvatarComponent } from './common/showAvatar/showAvatar.component';
import { ShowPublicationComponent } from './common/showPublication/showPublication.component';
import { ShowConversationComponent } from './common/showConversation/showConversation.component';
import { ShowPhotoComponent } from './common/showPhoto/showPhoto.component';
import { NewPlaylistComponent } from './common/newPlaylist/newPlaylist.component';
import { ShowPlaylistComponent } from './common/showPlaylist/showPlaylist.component';
import { NewAvatarComponent } from './common/newAvatar/newAvatar.component';
import { NewSessionComponent } from './common/newSession/newSession.component';

@NgModule({
	imports: [
		CommonModule,
		PagesRouting,
		HttpModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		SwiperModule,
		CdkTableModule,
		MatAutocompleteModule,
		MatBadgeModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatTreeModule
	],
	exports: [
		CdkTableModule,
		MatAutocompleteModule,
		MatBadgeModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatTreeModule
	],
	declarations: [
		TimeagoPipe,
		ReversePipe,
		SafeHtmlPipe,
		routableComponents,
		PagesComponent,
		NewPublicationComponent,
		NewPublicationAddPhotosComponent,
		NewPublicationAddAudiosComponent,
		ShowPublicationComponent,
		ShowAvatarComponent,
		ShowPhotoComponent,
		NewAvatarComponent,
		NewSessionComponent,
		ShowConversationComponent,
		NewReportComponent,
		NewPlaylistComponent,
		ShowPlaylistComponent,
		SessionPanelMobileComponent
	],
	entryComponents : [
		NewPublicationComponent,
		NewPublicationAddPhotosComponent,
		NewPublicationAddAudiosComponent,
		ShowPublicationComponent,
		ShowAvatarComponent,
		ShowPhotoComponent,
		NewAvatarComponent,
		NewSessionComponent,
		ShowConversationComponent,
		NewReportComponent,
		NewPlaylistComponent,
		ShowPlaylistComponent,
		SessionPanelMobileComponent
	],
	providers: [
		UserDataService,
		AudioDataService,
		PhotoDataService,
		FollowsDataService,
		PublicationsDataService,
		NotificationsDataService,
		ChatDataService,
		SessionService,
		PlayerService,
		MetaService,
		HeadersService,
		// WebsocketService,
		// ChatsocketService,
	]
})
export class PagesModule { }

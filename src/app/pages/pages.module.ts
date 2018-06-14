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

import { UserDataService } from '../core/services/user/userData';
import { AudioDataService } from '../core/services/user/audioData';
import { PhotoDataService } from '../core/services/user/photoData';
import { FollowsDataService } from '../core/services/user/followsData';
import { PublicationsDataService } from '../core/services/user/publicationsData';
import { NotificationsDataService } from '../core/services/user/notificationsData';
import { ChatDataService } from '../core/services/user/chatData';

import { SessionService } from '../core/services/session/session.service';
import { PlayerService } from '../core/services/player/player.service';
import { WebsocketService } from '../core/services/websocket/websocket.service';
import { ChatsocketService } from '../core/services/websocket/chat.service';
import { MetaService } from '../core/services/meta/meta.service';

import { AudiosNewPlaylistComponent } from './user/audios/newPlaylist/newPlaylist.component';
import { AudiosShowPlaylistComponent } from './user/audios/showPlaylist/showPlaylist.component';
import { MainNewPublicationComponent } from './user/main/newPublication/newPublication.component';
import { MainNewPublicationAddPhotosComponent } from './user/main/newPublication/addPhotos/addPhotos.component';
import { MainNewPublicationAddAudiosComponent } from './user/main/newPublication/addAudios/addAudios.component';
import { MainShowPublicationComponent } from './user/main/showPublication/showPublication.component';
import { MainShowAvatarComponent } from './user/main/showAvatar/showAvatar.component';
import { NotificationsShowConversationComponent } from './user/notifications/showConversation/showConversation.component';
import { ReportComponent } from './user/_common/report/report.component';
import { PhotosShowPhotoComponent } from './user/photos/showPhoto/showPhoto.component';
import { SettingsAvatarComponent } from './user/settings/avatar/avatar.component';
import { SettingsBackgroundComponent } from './user/settings/background/background.component';
import { SettingsSessionComponent } from './user/settings/session/session.component';
import { SessionPanelMobileComponent } from './user/_common/sessionPanelMobile/sessionPanelMobile.component';

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
		MainNewPublicationComponent,
		MainNewPublicationAddPhotosComponent,
		MainNewPublicationAddAudiosComponent,
		MainShowPublicationComponent,
		MainShowAvatarComponent,
		PhotosShowPhotoComponent,
		SettingsAvatarComponent,
		SettingsBackgroundComponent,
		SettingsSessionComponent,
		NotificationsShowConversationComponent,
		ReportComponent,
		AudiosNewPlaylistComponent,
		AudiosShowPlaylistComponent,
		SessionPanelMobileComponent
	],
	entryComponents : [
		MainNewPublicationComponent,
		MainNewPublicationAddPhotosComponent,
		MainNewPublicationAddAudiosComponent,
		MainShowPublicationComponent,
		MainShowAvatarComponent,
		PhotosShowPhotoComponent,
		SettingsAvatarComponent,
		SettingsBackgroundComponent,
		SettingsSessionComponent,
		NotificationsShowConversationComponent,
		ReportComponent,
		AudiosNewPlaylistComponent,
		AudiosShowPlaylistComponent,
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
		WebsocketService,
		ChatsocketService,
		MetaService
	]
})
export class PagesModule { }

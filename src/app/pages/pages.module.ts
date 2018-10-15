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

// Routing pages
import { PagesRouting, routableComponents } from './pages.routing';
import { PagesComponent } from './pages.component';

// Pipe
import { PipesModule } from '../core/pipes/pipes.module';

// Services
import { AudioDataService } from '../core/services/user/audioData.service';
import { BookmarksDataService } from '../core/services/user/bookmarksData.service';
import { FollowsDataService } from '../core/services/user/followsData.service';
import { ChatDataService } from '../core/services/user/chatData.service';
import { NotificationsDataService } from '../core/services/user/notificationsData.service';
import { PhotoDataService } from '../core/services/user/photoData.service';
import { PublicationsDataService } from '../core/services/user/publicationsData.service';
import { UserDataService } from '../core/services/user/userData.service';
import { SessionService } from '../core/services/session/session.service';
import { PlayerService } from '../core/services/player/player.service';
import { MetaService } from '../core/services/meta/meta.service';
import { MomentService } from '../core/services/moment/moment.service';
import { HeadersService } from '../core/services/headers/headers.service';

// ***** Web Socket
// TODO: import { WebsocketService } from '../core/services/websocket/websocket.service';
// TODO: import { ChatsocketService } from '../core/services/websocket/chat.service';

// Entry
import { NewPlaylistComponent } from './common/newPlaylist/newPlaylist.component';
import { NewReportComponent } from './common/newReport/newReport.component';
import { NewSessionComponent } from './common/newSession/newSession.component';
import { ShowConversationComponent } from './common/showConversation/showConversation.component';
import { ShowLikesComponent } from './common/showLikes/showLikes.component';
import { ShowPhotoComponent } from './common/showPhoto/showPhoto.component';
import { ShowPublicationComponent } from './common/showPublication/showPublication.component';
import { ShowSessionPanelMobileComponent } from './common/showSessionPanelMobile/showSessionPanelMobile.component';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		PagesRouting,
		HttpModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule
	],
	exports: [
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatDialogModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule
	],
	declarations: [
		routableComponents,
		PagesComponent
	],
	entryComponents : [
		NewSessionComponent,
		NewReportComponent,
		NewPlaylistComponent,
		ShowConversationComponent,
		ShowLikesComponent,
		ShowPhotoComponent,
		ShowPublicationComponent,
		ShowSessionPanelMobileComponent
	],
	providers: [
		AudioDataService,
		BookmarksDataService,
		ChatDataService,
		FollowsDataService,
		HeadersService,
		MetaService,
		MomentService,
		NotificationsDataService,
		PhotoDataService,
		PlayerService,
		PublicationsDataService,
		SessionService,
		UserDataService
		
		// TODO: WebsocketService,
		// TODO: ChatsocketService
	]
})
export class PagesModule { }

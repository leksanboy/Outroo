import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AudiosComponent } from './user/audios/audios.component';
import { BookmarksComponent } from './user/bookmarks/bookmarks.component';
import { FollowersComponent } from './user/followers/followers.component';
import { FollowingComponent } from './user/following/following.component';
import { HomeComponent } from './user/home/home.component';
import { MainComponent } from './user/main/main.component';
import { NewsComponent } from './user/news/news.component';
import { NotificationsComponent } from './user/notifications/notifications.component';
import { PhotosComponent } from './user/photos/photos.component';
import { SettingsComponent } from './user/settings/settings.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
	{
		path: 'about',
		loadChildren: './web/about/about.module#AboutModule'
	},{
		path: 'confirm-email/:code',
		loadChildren: './web/confirm-email/confirm-email.module#ConfirmEmailModule'
	},{
		path: 'forgot-password',
		loadChildren: './web/forgot-password/forgot-password.module#ForgotPasswordModule'
	},{
		path: 'privacy',
		loadChildren: './web/privacy/privacy.module#PrivacyModule'
	},{
		path: 'reset-password/:code',
		loadChildren: './web/reset-password/reset-password.module#ResetPasswordModule'
	},{
		path: 'signin',
		loadChildren: './web/signin/signin.module#SigninModule'
	},{
		path: 'signup',
		loadChildren: './web/signup/signup.module#SignupModule'
	},{
		path: 'support',
		loadChildren: './web/support/support.module#SupportModule'
	},{
		path: 'logout',
		loadChildren: './web/logout/logout.module#LogoutModule'
	},{
		path: '',
		component: UserComponent,
		children: [
			{
				path: 'home',
				component: HomeComponent
				// loadChildren: './user/home/home.module#HomeModule'
			},{
				path: 'news',
				component: NewsComponent
				// loadChildren: './user/news/news.module#NewsModule'
			},{
				path: 'news/:name',
				component: NewsComponent
				// loadChildren: './user/news/news.module#NewsModule'
			},{
				path: 'saved',
				component: BookmarksComponent
				// loadChildren: './user/saved/saved.module#SavedModule'
			},{
				path: 'notifications',
				component: NotificationsComponent
				// loadChildren: './user/notifications/notifications.module#NotificationsModule'
			},{
				path: 'settings',
				component: SettingsComponent
				// loadChildren: './user/settings/settings.module#SettingsModule'
			},{
				path: ':id',
				component: MainComponent
				// loadChildren: './user/main/main.module#MainModule'
			},{
				path: ':id/photos',
				component: PhotosComponent
				// loadChildren: './user/photos/photos.module#PhotosModule'
			},{
				path: ':id/photos/:name',
				component: PhotosComponent
				// loadChildren: './user/photos/photos.module#PhotosModule'
			},{
				path: ':id/audios',
				component: AudiosComponent
				// loadChildren: './user/audios/audios.module#AudiosModule'
			},{
				path: ':id/following',
				component: FollowingComponent
				// loadChildren: './user/following/following.module#FollowingModule'
			},{
				path: ':id/followers',
				component: FollowersComponent
				// loadChildren: './user/followers/followers.module#FollowersModule'
			}
		]
	},{
		path: '**',
		loadChildren: './web/error/error.module#ErrorModule'
	}
];

export const routableComponents = [
	AudiosComponent,
	BookmarksComponent,
	FollowersComponent,
	FollowingComponent,
	HomeComponent,
	MainComponent,
	NewsComponent,
	NotificationsComponent,
	PhotosComponent,
	SettingsComponent,
	UserComponent
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class PagesRouting { }

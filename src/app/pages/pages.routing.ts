import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
				loadChildren: './user/home/home.module#HomeModule'
			},{
				path: 'saved',
				loadChildren: './user/bookmarks/bookmarks.module#BookmarksModule'
			},{
				path: 'notifications',
				loadChildren: './user/notifications/notifications.module#NotificationsModule'
			},{
				path: 'settings',
				loadChildren: './user/settings/settings.module#SettingsModule'
			},{
				path: 'news',
				loadChildren: './user/news/news.module#NewsModule'
			},{
				path: 'news/:name',
				loadChildren: './user/news/news.module#NewsModule'
			},{
				path: ':id',
				loadChildren: './user/main/main.module#MainModule'
			},{
				path: ':id/photos',
				loadChildren: './user/photos/photos.module#PhotosModule'
			},{
				path: ':id/photos/:name',
				loadChildren: './user/photos/photos.module#PhotosModule'
			},{
				path: ':id/audios',
				loadChildren: './user/audios/audios.module#AudiosModule'
			},{
				path: ':id/following',
				loadChildren: './user/following/following.module#FollowingModule'
			},{
				path: ':id/followers',
				loadChildren: './user/followers/followers.module#FollowersModule'
			}
		]
	},{
		path: '**',
		loadChildren: './web/error/error.module#ErrorModule'
	}
];

export const routableComponents = [
	UserComponent
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class PagesRouting { }

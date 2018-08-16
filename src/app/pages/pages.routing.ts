import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './web/about/about.component';
import { ConfirmEmailComponent } from './web/confirm-email/confirm-email.component';
import { ErrorComponent } from './web/error/error.component';
import { ForgotPasswordComponent } from './web/forgot-password/forgot-password.component';
import { PrivacyComponent } from './web/privacy/privacy.component';
import { ResetPasswordComponent } from './web/reset-password/reset-password.component';
import { SigninComponent } from './web/signin/signin.component';
import { SignupComponent } from './web/signup/signup.component';
import { SupportComponent } from './web/support/support.component';

import { AudiosComponent } from './user/audios/audios.component';
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
		component: AboutComponent
	},{
		path: 'confirm-email/:code',
		component: ConfirmEmailComponent
	},{
		path: 'forgot-password',
		component: ForgotPasswordComponent
	},{
		path: 'privacy',
		component: PrivacyComponent
	},{
		path: 'reset-password/:code',
		component: ResetPasswordComponent
	},{
		path: 'signin',
		component: SigninComponent
	},{
		path: 'signup',
		component: SignupComponent
	},{
		path: 'support',
		component: SupportComponent
	},{
		path: '',
		component: UserComponent,
		children: [
			{
				path: 'home',
				component: HomeComponent
			},{
				path: 'news',
				component: NewsComponent
			},{
				path: 'notifications',
				component: NotificationsComponent
			},{
				path: 'settings',
				component: SettingsComponent
			},{
				path: ':id',
				component: MainComponent
			},{
				path: ':id/photos',
				component: PhotosComponent
			},{
				path: ':id/photos/:name',
				component: PhotosComponent
			},{
				path: ':id/audios',
				component: AudiosComponent
			},{
				path: ':id/following',
				component: FollowingComponent
			},{
				path: ':id/followers',
				component: FollowersComponent
			}
		]
	},{
		path: '**',
		component: ErrorComponent
	}
];

export const routableComponents = [
		AboutComponent,
		ConfirmEmailComponent,
		ErrorComponent,
		ForgotPasswordComponent,
		PrivacyComponent,
		ResetPasswordComponent,
		SigninComponent,
		SignupComponent,
		SupportComponent,
		AudiosComponent,
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

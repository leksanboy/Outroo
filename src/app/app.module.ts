/*******************************************************************
				______        __  
			   /  __  \__  __/ /_ ___  ____  ____
			  /  / /  / / / / __/ __ / __  `/ __ `
			 /  /_/  / /_/ / /_/ /  / /_/ // /_/ /
			 \______/\____/\__/_/   \____/ \____/

	<copyright owner="Sasá Rafalsky" company="Rafalsky Industries">
		Copyright (c) 2017 Outhroo. All rights reserved.
	</copyright>

*******************************************************************/

import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';

import { environment } from '../environments/environment';
import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';

// Alert
import { AlertService } from './core/services/alert/alert.service';
import { AlertComponent } from './core/services/alert/alert.component';

// Audio player mobile
import { ShowAudioPlayerMobileService } from './pages/common/showAudioPlayerMobile/showAudioPlayerMobile.service';
import { ShowAudioPlayerMobileComponent } from './pages/common/showAudioPlayerMobile/showAudioPlayerMobile.component';

@NgModule({
	declarations: [
		AppComponent,
		AlertComponent,
		ShowAudioPlayerMobileComponent
	],
	imports: [
		BrowserModule,
		ServiceWorkerModule.register('/ngsw-worker.js', { 
			enabled: environment.production 
		}),
		HttpModule,
		AppRouting,
		PagesModule
	],
	providers: [
		{
			provide: LocationStrategy,
			useClass: PathLocationStrategy
		},
		Title,
		AlertService,
		ShowAudioPlayerMobileService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }

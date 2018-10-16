import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	// --> https://github.com/johnpapa/pwa-angular
}

// import { Component } from '@angular/core';
// import { environment } from '../environments/environment';
// import { MetaService } from '../app/core/services/meta/meta.service';
// import { UserDataService } from '../app/core/services/user/userData.service';

// @Component({
// 	selector: 'app-root',
// 	templateUrl: './app.component.html'
// })
// export class AppComponent {
// 	// --> https://github.com/johnpapa/pwa-angular
// 	public environment: any = environment;

// 	constructor(
// 		private metaService: MetaService,
// 		private userDataService: UserDataService
// 	){
// 		// Get url data
// 		let urlData: any = window.location.href;
// 		var split = urlData.split('/');
// 		urlData = split[split.length-1];

// 		console.log("APP:", urlData);

// 		// Get user data
// 		this.siteUserData(urlData);
// 	}

// 	// User data of the page
// 	siteUserData(id){
// 		this.userDataService.getUserData(id)
// 			.subscribe(res => {
// 				if (res) {
// 					// Meta data
// 					let title = res.name + ' (@'+res.username+')';
// 					let metaData = {
// 						page: title,
// 						title: title,
// 						description: res.aboutOriginal,
// 						keywords: res.aboutOriginal,
// 						url: this.environment.url + res.username,
// 						image: this.environment.url + (res.avatar ? res.avatarUrl : this.environment.avatar)
// 					}

// 					console.log("APP metaData:", metaData);

// 					// Call metaService
// 					this.metaService.setData(metaData);
// 				}
// 			});
// 	}
// }

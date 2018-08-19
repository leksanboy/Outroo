import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';

import { environment } from '../../../../environments/environment';
import { SessionService } from '../session/session.service';

@Injectable()
export class HeadersService {
	public numberOfClicks: any = [];
	public limitedClicksPerSecond = 15;
	public limitedTime = 1000;

	constructor(
		private sessionService: SessionService,
	) {}

	getHeaders() {
		let userData: any = JSON.parse(localStorage.getItem('userData_Outhroo'));
		let id = userData ? userData.current.id : 0;
		let auth = userData ? userData.current.authorization : 'pWtcN';
		let authorization = id + 'xQ3s1RVrSR' + auth;
		
		// VAlidate authorization
		let authorizationValidator = this.clicksPerSecond() ? authorization : null;

		if (!authorizationValidator)
			alert("STOP DOING THAT");

		// Headers
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', authorizationValidator);

		return new RequestOptions({ headers: headers });
	}

	clicksPerSecond() {
		if(this.numberOfClicks.length < this.limitedClicksPerSecond) {
		   this.numberOfClicks.push(new Date().getTime());

		   return true;
		} else {
			let diff = this.numberOfClicks[this.numberOfClicks.length -1] - this.numberOfClicks[0];
			
			// If is into limitedTime
			this.numberOfClicks.shift();
			this.numberOfClicks.push(new Date().getTime());
			
			// Return false for error to cancel other petitions
			return (diff < this.limitedTime) ? false : true;
		}
	}
}

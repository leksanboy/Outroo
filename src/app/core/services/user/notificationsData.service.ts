import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotificationsDataService {

	constructor(
		private http: Http
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/notifications/default.php';
		let params =	'?user=' + data.user + 
						'&rows=' + data.rows + 
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	generateNotification(data: any){
		let url = environment.url + 'assets/api/notifications/notificate.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	pending(id: any) {
		let url = environment.url + 'assets/api/notifications/pending.php';
		let params =	'?id=' + id;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}
}

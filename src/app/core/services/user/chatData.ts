import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatDataService {

	constructor(
		private http: Http
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/chat/default.php';
		let params =	'?user=' + data.user +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	addRemove(data: any) {
		let url = environment.url + 'assets/api/chat/addRemove.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	comment(data: any) {
		let url = environment.url + 'assets/api/chat/comment.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	newChat(data: any){
		let url = environment.url + 'assets/api/chat/newChat.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}
}

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FollowsDataService {

	constructor(
		private http: Http
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/follows/default.php';
		let params =	'?session=' + data.session +
						'&user=' + data.user +
						'&type=' + data.type +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	search(data: any){
		let url = environment.url + 'assets/api/follows/search.php';
		let params = 	'?session=' + data.session +
						'&user=' + data.user +
						'&caption=' + data.caption +
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	followUnfollow(data: any) {
		let url = environment.url + 'assets/api/follows/followUnfollow.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	checkFollowing(data: any) {
		let url = environment.url + 'assets/api/follows/checkFollowing.php';
		let params = 	'?sender=' + data.sender +
						'&receiver=' + data.receiver;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}
}

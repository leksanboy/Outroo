import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PhotoDataService {

	constructor(
		private http: Http
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/photos/default.php';
		let params =	'?user=' + data.user + 
						'&rows=' + data.rows +
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	addRemove(data: any) {
		let url = environment.url + 'assets/api/photos/addRemove.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	enableDisableComments(data: any) {
		let url = environment.url + 'assets/api/photos/enableDisableComments.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	updateReplays(data: any) {
		let url = environment.url + 'assets/api/photos/updateReplays.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	comment(data: any) {
		let url = environment.url + 'assets/api/photos/comment.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	comments(data: any) {
		let url = environment.url + 'assets/api/photos/comments.php';
		let params =	'?id=' + data.id + 
						'&rows=' + data.rows + 
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	likeUnlike(data: any) {
		let url = environment.url + 'assets/api/photos/likeUnlike.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	checkLike(data: any) {
		let url = environment.url + 'assets/api/photos/checkLike.php';
		let params = 	'?id=' + data.id + 
						'&user=' + data.user;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	getDataByName(data: any) {
		let url = environment.url + 'assets/api/photos/getDataByName.php';
		let params =	'?name=' + data;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}
}

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PublicationsDataService {
	
	constructor(
		private http: Http
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/publications/default.php';
		let params =	'?user=' + data.user + 
						'&session=' + data.session + 
						'&type=' + data.type + 
						'&rows=' + data.rows + 
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	createPublication(data: any) {
		let url = environment.url + 'assets/api/publications/create.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	addRemove(data: any) {
		let url = environment.url + 'assets/api/publications/addRemove.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	likeUnlike(data: any) {
		let url = environment.url + 'assets/api/publications/likeUnlike.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	enableDisableComments(data: any) {
		let url = environment.url + 'assets/api/publications/enableDisableComments.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	comment(data: any) {
		let url = environment.url + 'assets/api/publications/comment.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	comments(data: any) {
		let url = environment.url + 'assets/api/publications/comments.php';
		let params =	'?id=' + data.id + 
						'&rows=' + data.rows + 
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	getDataByName(data: any) {
		let url = environment.url + 'assets/api/publications/getDataByName.php';
		let params =	'?name=' + data;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	updateReplays(data: any) {
		let url = environment.url + 'assets/api/publications/updateReplays.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	checkLike(data: any) {
		let url = environment.url + 'assets/api/publications/checkLike.php';
		let params = 	'?id=' + data.id + 
						'&user=' + data.user;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	search(data: any){
		let url = environment.url + 'assets/api/publications/search.php';
		let params = 	'?session=' + data.session + 
						'&caption=' + data.caption + 
						'&rows=' + data.rows + 
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	urlVideoInformation(data: any) {
		let url = environment.url + 'assets/api/publications/urlVideoInformation.php';
		let params =	'?type=' + data.type +
						'&url=' + data.url;

		return this.http.get(url + params)
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}
}

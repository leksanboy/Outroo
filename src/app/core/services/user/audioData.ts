import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AudioDataService {

	constructor(
		private http: Http
	) { }

	default(data: any) {
		let url = environment.url + 'assets/api/audios/default.php';
		let params =	(data.user ? ('&user=' + data.user) : '') + 
						'&type=' + data.type + 
						'&rows=' + data.rows + 
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params.replace('&', '?'))
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	search(data: any){
		let url = environment.url + 'assets/api/audios/search.php';
		let params = 	'&caption=' + data.caption + 
						'&rows=' + data.rows + 
						'&cuantity=' + data.cuantity;

		return this.http.get(url + params.replace('&', '?'))
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	addRemove(data: any) {
		let url = environment.url + 'assets/api/audios/addRemove.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	updateReplays(data: any) {
		let url = environment.url + 'assets/api/audios/updateReplays.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	defaultPlaylists(data: any) {
		let url = environment.url + 'assets/api/audios/defaultPlaylists.php';
		let params =	'&user=' + data.user +
						'&session=' + data.session + 
						'&type=' + data.type;

		return this.http.get(url + params.replace('&', '?'))
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	defaultPlaylistSongs(data: any) {
		let url = environment.url + 'assets/api/audios/defaultPlaylistSongs.php';
		let params =	'&id=' + data.id;

		return this.http.get(url + params.replace('&', '?'))
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	createPlaylist(data: any) {
		let url = environment.url + 'assets/api/audios/createPlaylist.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	addRemovePlaylist(data: any) {
		let url = environment.url + 'assets/api/audios/addRemovePlaylist.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}

	publicPrivate(data: any) {
		let url = environment.url + 'assets/api/audios/publicPrivate.php';
		let params = data;

		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post(url, params, { headers: headers })
			.pipe(map((res: Response) => { 
				return res.json() 
			}));
	}
}

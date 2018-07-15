import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';

import { environment } from '../../../../environments/environment';
import { SessionService } from '../session/session.service';

@Injectable()
export class HeadersService {
    constructor(
        private sessionService: SessionService,
    ) { }

    getHeaders() {
        let userData: any = JSON.parse(localStorage.getItem('userData_Outhroo'));
        let id = userData ? userData.current.id : 0;
        let auth = userData ? userData.current.authorization : 'pWtcN';
        let authorization =  id + 'xQ3s1RVrSR' + auth;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', authorization);

        return new RequestOptions({ headers: headers });
    }
}

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SessionService {
    private subjectSetData = new Subject<any>();
    private subjectPendingNotifications = new Subject<any>();
    private subjectSetDataPlaylists = new Subject<any>();
    private subjectSetDataCreatePlaylist = new Subject<any>();
    private subjectSetDataAddAccount = new Subject<any>();
    private subjectSetDataTheme = new Subject<any>();
    private subjectSetDataReport = new Subject<any>();
    private subjectSetDataConversation = new Subject<any>();
    private subjectSetDataCopy = new Subject<any>();

    setData(data: string) {
        this.subjectSetData.next(data);
    }

    getData(): Observable<any> {
        return this.subjectSetData.asObservable();
    }

    setPendingNotifications(data: string) {
        this.subjectPendingNotifications.next(data);
    }

    getPendingNotifications(): Observable<any> {
        return this.subjectPendingNotifications.asObservable();
    }

    setDataPlaylists(data: string) {
        this.subjectSetDataPlaylists.next(data);
    }

    getDataPlaylists(): Observable<any> {
        return this.subjectSetDataPlaylists.asObservable();
    }

    setDataCreatePlaylist(data: any) {
        this.subjectSetDataCreatePlaylist.next(data);
    }

    getDataCreatePlaylist(): Observable<any> {
        return this.subjectSetDataCreatePlaylist.asObservable();
    }

    setDataAddAccount(data: any) {
        this.subjectSetDataAddAccount.next(data);
    }

    getDataAddAccount(): Observable<any> {
        return this.subjectSetDataAddAccount.asObservable();
    }

    setDataTheme(data: any) {
        this.subjectSetDataTheme.next(data);
    }

    getDataTheme(): Observable<any> {
        return this.subjectSetDataTheme.asObservable();
    }

    setDataReport(data: any) {
        this.subjectSetDataReport.next(data);
    }

    getDataReport(): Observable<any> {
        return this.subjectSetDataReport.asObservable();
    }

    setDataConversation(data: any) {
        this.subjectSetDataConversation.next(data);
    }

    getDataConversation(): Observable<any> {
        return this.subjectSetDataConversation.asObservable();
    }

    setDataCopy(data: any) {
        this.subjectSetDataCopy.next(data);
    }

    getDataCopy(): Observable<any> {
        return this.subjectSetDataCopy.asObservable();
    }
}

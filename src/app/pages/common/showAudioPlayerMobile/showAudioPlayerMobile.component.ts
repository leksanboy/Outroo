import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject, OnInit, OnDestroy, AfterViewInit, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { ShowAudioPlayerMobileService } from './showAudioPlayerMobile.service';

import { environment } from '../../../../environments/environment';

@Component({
	selector: 'showAudioPlayerMobile',
	templateUrl: './showAudioPlayerMobile.component.html',
	animations: [
		trigger('showFromBottomAnimation',[
			transition(':enter', [
				style({transform: 'translateY(100%)', 'opacity': 1}),
				animate('200ms', style({'transform': 'translateY(0)', '-webkit-transform': 'translateY(0)', 'opacity': 1}))
			]),
			transition(':leave', [
				style({transform: 'translateY(0)', 'opacity': 1}),
				animate('400ms', style({'transform': 'translateY(100%)', '-webkit-transform': 'translateY(100%)', 'opacity': 1}))
			])
		])
	]
})
export class ShowAudioPlayerMobileComponent implements OnInit, OnDestroy, AfterViewInit {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public activePlayer: any;
	public noData: boolean;
	public audio: any;
	public showPlayer: boolean;
	public showPlayerAnimation: boolean;
	public rippleColor: string = 'rgba(255, 255, 255, .15)';
	public _previousHTMLStyles: any = { top: '', left: '' };
	public _previousScrollPosition: any;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private viewportRuler: ViewportRuler,
		private alertService: AlertService,
		private audioDataService: AudioDataService,
		private showAudioPlayerMobileService: ShowAudioPlayerMobileService,
		private playerService: PlayerService,
		private sessionService: SessionService
	) {
		// Get player data
		this.activePlayer = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});
	}

	ngOnInit() {
		this.showAudioPlayerMobileService.getData()
			.subscribe(res => {
				if (res) {
					const root = this.document.documentElement;
		            this._previousScrollPosition = this.viewportRuler.getViewportScrollPosition();
		            // Cache the previous inline styles in case the user had set them.
		            this._previousHTMLStyles.left = root.style.left || '';
		            this._previousHTMLStyles.top = root.style.top || '';
		            // Note: we're using the `html` node, instead of the `body`, because the `body` may
		            // have the user agent margin, whereas the `html` is guaranteed not to have one.
		            root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
		            root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
		            root.classList.add('cdk-global-scrollblock');

					// Data
					this.showPlayer = true;
					setTimeout(() => {
						this.showPlayerAnimation = true;
					}, 100);
					this.sessionData = res.sessionData;
					this.translations = res.translations;
					this.audioPlayerData = res.data;
					this.audio = res.audio;
				}
			});
	}

	ngOnDestroy() {
		this.activePlayer.unsubscribe();
	}

	ngAfterViewInit() {
		let self = this;
		
		// Auto progress bar
		if (this.showPlayer) {
			this.audio.addEventListener('timeupdate', function() {
				let countDown = Math.round(self.audio.duration - self.audio.currentTime);
				self.audioPlayerData.current.time = self.formatTime(self.audio.currentTime);

				// Countdown time
				let durationCountDown = self.formatTime(countDown);
				self.audioPlayerData.current.duration = parseInt(durationCountDown.split(':')[1]) == 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;
				self.audioPlayerData.list[self.audioPlayerData.current.key].countdown = parseInt(durationCountDown.split(':')[1]) == 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;

				// Progress bar
				let progress = ((self.audio.currentTime / self.audio.duration) * 1000);
				self.audioPlayerData.current.progress = progress;
			});
		}
	}

	// Play/pause/shuffle/next/prev/repeat
	playTrack(type, key) {
		switch(type){
			case('item'):
				this.audioPlayerData.key = key;
				this.audioPlayerData.buttonType = 'item';
				this.playerService.setPlayTrack(this.audioPlayerData);
			break;
			case('play'):
				this.playTrack('item', this.audioPlayerData.key);
			break;
			case('prev'):
				this.audioPlayerData.key = key;
				this.audioPlayerData.buttonType = 'prev';
				this.playerService.setPlayTrack(this.audioPlayerData);
			break;
			case('next'):
				this.audioPlayerData.key = key;
				this.audioPlayerData.buttonType = 'next';
				this.playerService.setPlayTrack(this.audioPlayerData);
			break;
			case('shuffle'):
				this.audioPlayerData.shuffle = !this.audioPlayerData.shuffle;
				this.playerService.setCurrentTrack(this.audioPlayerData);
			break;
			case('repeat'):
				this.audioPlayerData.repeat = !this.audioPlayerData.repeat;
				this.playerService.setCurrentTrack(this.audioPlayerData);
			break;
		}
	}

	// Time format
	formatTime(time){
		let duration = time,
			hours = Math.floor(duration / 3600),
			minutes = Math.floor((duration % 3600) / 60),
			seconds = Math.floor(duration % 60),
			result = [];

		if (hours)
			result.push(hours)

		result.push(((hours ? "0" : "") + (minutes ? minutes : 0)).substr(-2));
		result.push(("0" + (seconds ? seconds : 0)).substr(-2));

		return result.join(":");
	}

	// Item options: add/remove, share, search, report
	itemAudiosOptions(type, item, playlist){
		switch(type){
			case("addRemoveSession"):
				item.addRemoveSession = !item.addRemoveSession;
				item.type = item.addRemoveSession ? 'remove' : 'add';

				let dataARS = {
					user: this.sessionData.current.id,
					type: item.type,
					location: 'session',
					id: item.id
				}

				this.audioDataService.addRemove(dataARS)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = !item.addRemoveSession ? ' has been added successfully' : ' has been removed';
						
						this.alertService.success(song + text);
					}, error => {
						this.alertService.success('An error has ocurred');
					});
			break;
			case("addRemoveUser"):
				item.addRemoveUser = !item.addRemoveUser;
				item.type = item.addRemoveUser ? 'add' : 'remove';

				let dataARO = {
					user: this.sessionData.current.id,
					type: item.type,
					location: 'user',
					id: item.insertedId,
					item: item.song
				}

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
						item.insertedId = res.json();
						
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = item.addRemoveUser ? ' has been added successfully' : ' has been removed';
						
						this.alertService.success(song + text);
					}, error => {
						this.alertService.success('An error has ocurred');
					});
			break;
			case("playlist"):
				item.type = !item.addRemoveUser ? "add" : "remove";

				let dataP = {
					user: this.sessionData.current.id,
					type: item.type,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				}

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title;
						this.alertService.success(song + ' has been added to ' + playlist.title);
					}, error => {
						this.alertService.success('An error has ocurred');
					});
			break;
			case("createPlaylist"):
				let data = 'create';
				this.sessionService.setDataCreatePlaylist(data);
			break;
			case("report"):
				item.type = 'audio';
				this.sessionService.setDataReport(item);
			break;
		}
	}

	// Progress bar
	progressBar(event){
		let time = ((event.value / 1000) * this.audio.duration);
		this.audio.currentTime = time;
	}

	// Close sheet
	close(){
		const html = this.document.documentElement;
        const body = this.document.body;
        const previousHtmlScrollBehavior = html.style['scrollBehavior'] || '';
        const previousBodyScrollBehavior = body.style['scrollBehavior'] || '';
        html.style.left = this._previousHTMLStyles.left;
        html.style.top = this._previousHTMLStyles.top;
        html.classList.remove('cdk-global-scrollblock');
        // Disable user-defined smooth scrolling temporarily while we restore the scroll position.
        // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
        html.style['scrollBehavior'] = body.style['scrollBehavior'] = 'auto';
        window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
        html.style['scrollBehavior'] = previousHtmlScrollBehavior;
        body.style['scrollBehavior'] = previousBodyScrollBehavior;

		// Data
		this.showPlayerAnimation = false;
		setTimeout(() => {
			this.showPlayer = false;
		}, 500);
	}
}
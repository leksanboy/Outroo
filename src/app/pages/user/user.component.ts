import { DOCUMENT } from '@angular/platform-browser';
import { Component, AfterViewInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatBottomSheet } from '@angular/material';
import { Location, PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { AlertService } from '../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../app/core/services/user/audioData';
import { AudioPlayerMobileService } from '../../../app/pages/user/_common/audioPlayerMobile/audioPlayerMobile.service';
import { NotificationsDataService } from '../../../app/core/services/user/notificationsData';
import { PlayerService } from '../../../app/core/services/player/player.service';
import { SessionService } from '../../../app/core/services/session/session.service';
import { UserDataService } from '../../../app/core/services/user/userData';

import { AudiosNewPlaylistComponent } from '../../../app/pages/user/audios/newPlaylist/newPlaylist.component';
import { ReportComponent } from '../../../app/pages/user/_common/report/report.component';
import { SessionPanelMobileComponent } from '../../../app/pages/user/_common/sessionPanelMobile/sessionPanelMobile.component';
import { SettingsSessionComponent } from '../../../app/pages/user/settings/session/session.component';

// import { ChatsocketService } from '../../../app/core/services/websocket/chat.service';

import 'hammerjs';

declare var navigator: any;
declare var MediaMetadata: any;
declare var AudioContext: any;
declare var Vibrant: any;

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html'
})
export class UserComponent implements AfterViewInit {
	public environment: any = environment;
	public navMenu: boolean;
	public sessionData: any = [];
	public translations: any = [];
	public deniedAccessOnlySession: boolean;
	public showPlayer: boolean;
	public showSessions: boolean;
	public showPlaylist: boolean;
	public showUserBox: boolean;
	public showCloseSession: boolean;
	public showChangeSession: boolean;
	public showChangeSessionOnMenu: boolean;
	public showChangeLanguage: boolean;
	public signingBox: boolean;
	public signOutCurrent: boolean;
	public noData: boolean;
	public loadingData: boolean = true;
	public loadingMoreData: boolean;
	public audio = new Audio();
	public audioPlayerData: any = [];

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public dialog: MatDialog,
		private location: Location,
		private platformLocation: PlatformLocation,
		private router: Router,
		private playerService: PlayerService,
		private sessionService: SessionService,
		private alertService: AlertService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private notificationsDataService: NotificationsDataService,
		private audioPlayerMobileService: AudioPlayerMobileService,
		private bottomSheet: MatBottomSheet,
		// TODO: private chatsocketService: ChatsocketService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();
		this.audioPlayerData = {
			path: 'assets/media/audios/',
			key: 0,
			repeat: false,
			shuffle: false,
			playing: false,
			loadingToPlay: false,
			equalizerInitialized: false,
			volume: {
				mute: false,
				beforeMuteValue: 75,
				value: 75
			},
			current: {
				title: "Loading...",
				time: "0:00",
				duration: "0:00",
				image: "",
				key: 0,
				progress: 0,
				initialized: false,
				type: 'default',
				addRemoveSession: null,
				addRemoveOther: null,
				color: null
			},
			list: []
		};

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// iPhone X
		if (screen.height == 812)
			this.document.body.classList.add('iphoneXClass');

		// Return home if no access
		if (!this.sessionData) {
			this.sessionData = [];
			this.sessionData.current = [];
			this.deniedAccessOnlySession = true;

			if (this.router.url == '/settings' || this.router.url == '/notifications' || this.router.url == '/news' || this.router.url == '/home') {
				this.userDataService.noSessionData();
				console.log("No tengo session y no puedo acceder a settings, notifications, news, home");
			} else {
				console.log("No tengo session pero puedo ver ciertas paginas :::> [", this.router.url, ']')
			}
		} else {
			console.log("Session existe: ", this.router.url);

			// Add dark theme
			if (this.sessionData.current.theme)
				this.document.body.classList.add('darkTheme');
			else
				this.document.body.classList.remove('darkTheme');

			// Set list information
			this.sessionData.current.listInformation = null;

			// Load default
			this.defaultAudios(this.sessionData.current.username);

			// Pending notifications
			this.pendingNotifications();
			setInterval(() => {
				this.pendingNotifications();
			}, 1000 * 60 * 15);

			// Get player data
			this.playerService.getData()
				.subscribe(data => {
					this.showPlaylist = true;
					this.noData = false;
					this.audioPlayerData.postId = data.postId;
					this.audioPlayerData.list = data.list;
					this.audioPlayerData.item = data.item;
					this.audioPlayerData.key = data.key;
					this.audioPlayerData.user = data.user;
					this.audioPlayerData.username = data.username;
					this.audioPlayerData.location = data.location;
					this.audioPlayerData.type = data.type;
					this.audioPlayerData.selectedIndex = data.selectedIndex;
					this.audioPlayerData.current.key = -1;
					this.playTrack('item', data.key);
				});

			// Get play/pause track
			this.playerService.getPlayTrack()
				.subscribe(data => {
					if (data.buttonType == 'next')
						this.playTrack('next', data.key);
					else if (data.buttonType == 'prev')
						this.playTrack('prev', data.key);
					else
						this.playTrack('item', data.key);
				});

			// Get session data
			this.sessionService.getData()
				.subscribe(data => {
					this.sessionData = data;

					// Get translations
					this.getTranslations(data.current.language);
				});

			// Get pending notifications
			this.sessionService.getPendingNotifications()
				.subscribe(data => {
					this.pendingNotifications();
				});

			// Get session playlists
			this.sessionService.getDataPlaylists()
				.subscribe(data => {
					this.sessionData = data;
				});

			// Get session create playlist
			this.sessionService.getDataCreatePlaylist()
				.subscribe(data => {
					this.itemAudiosOptions('createPlaylist', null, null);
				});

			// Get session add account
			this.sessionService.getDataAddAccount()
				.subscribe(data => {
					if (data.type == 'create')
						this.openNewSession();
					else if (data.type == 'set')
						this.setCurrentUser(data.data);
					else if (data.type == 'close')
						this.closeSession(data.data);
				});

			// Get session data theme
			this.sessionService.getDataTheme()
				.subscribe(data => {
					this.sessionData = data;
				});

			// Get report
			this.sessionService.getDataReport()
				.subscribe(data => {
					this.openReport(data);
				});

			// Get share
			this.sessionService.getDataShare()
				.subscribe(data => {
					alert("SHARE");
					// this.openShare(data);
				});

			// Pressed back
			this.platformLocation.onPopState(() => {
				this.location.go(this.router.url);
				this.showSessions = false;
		        this.showPlayer = false;
		    });
		}
	}

	// Audios player · document ready -> audio addEventListener
	ngAfterViewInit() {
		let self = this;

		// Check if can play
		this.audio.addEventListener('canplay', function() {
			self.audioPlayerData.loadingToPlay = false;
			self.audio.play();
		});

		// Pause
		this.audio.addEventListener('pause', function() {
			self.playTrack('pause', self.audioPlayerData.current.key);
		});

		// Playing
		this.audio.addEventListener('playing', function() {
			self.playTrack('playing', self.audioPlayerData.current.key);

			if ('mediaSession' in navigator)
				self.updateMetadata();
		});

		// Progress bar and timing
		this.audio.addEventListener('timeupdate', function() {
			let countDown = Math.round(self.audio.duration - self.audio.currentTime);
			self.audioPlayerData.current.time = self.formatTime(self.audio.currentTime);

			let durationCountDown = self.formatTime(countDown);
			self.audioPlayerData.current.duration = parseInt(durationCountDown.split(':')[1]) == 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;
			self.audioPlayerData.list[self.audioPlayerData.current.key].countdown = parseInt(durationCountDown.split(':')[1]) == 0 ? self.audioPlayerData.list[self.audioPlayerData.current.key].duration : durationCountDown;

			let progress = ((self.audio.currentTime / self.audio.duration) * 1000);
			self.audioPlayerData.current.progress = progress;
		});

		// Song endeed
		this.audio.addEventListener('ended', function() {
			let key;

			if (self.audioPlayerData.repeat) {
				key = self.audioPlayerData.current.key;
			} else {
				if (self.audioPlayerData.shuffle)
					key = Math.floor(Math.random() * self.audioPlayerData.list.length) + 0;
				else
					key = (self.audioPlayerData.list.length == self.audioPlayerData.current.key+1) ? 0 : self.audioPlayerData.current.key+1;
			}

			// Check if is ad item
			if (self.audioPlayerData.list[key].contentTypeAd)
				key = key + 1;

			self.playTrack('item', key);
		});

		// Mediasession generate background player
		if ('mediaSession' in navigator) {
			navigator.mediaSession.setActionHandler('play', function() {
				self.playTrack('playing', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
			navigator.mediaSession.setActionHandler('pause', function() {
				self.playTrack('pause', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
			navigator.mediaSession.setActionHandler('previoustrack', function() {
				self.playTrack('prev', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
			navigator.mediaSession.setActionHandler('nexttrack', function() {
				self.playTrack('next', self.audioPlayerData.current.key);
				self.updateMetadata();
			});
		}
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Scroll to top
	scrollTop(){
		window.scrollTo(0, 0);
	}

	// Pending notifications
	pendingNotifications(){
		this.notificationsDataService.pending(this.sessionData.current.id)
			.subscribe(res => {
				this.sessionData.current.countPendingNotifications = res;
			});
	}

	// Update session data
	updateSessionDataFromSettings(data){
		this.sessionData = data;
	}

	// Default audios
	defaultAudios(user) {
		let data = {
			user: user,
			type: 'default',
			rows: 0,
			cuantity: environment.cuantity
		}

		this.audioDataService.default(data)
			.subscribe(res => {
				this.loadingData = false;

				if (res.length == 0) {
					this.noData = true;
					this.audioPlayerData.current.title = "Upload or search some songs";
				} else {
					this.noData = false;
					this.audioPlayerData.list = res;
					this.audioPlayerData.current.original_title = res[0].original_title ? res[0].original_title : res[0].title;
					this.audioPlayerData.current.original_artist = res[0].original_artist ? res[0].original_artist : res[0].title;
					this.audioPlayerData.current.duration = res[0].duration;
					this.audioPlayerData.current.image = res[0].image ? (this.audioPlayerData.path + "thumbnails/" + res[0].image) : '';

					this.audioPlayerData.item = res[0];
					this.audioPlayerData.key = 0;
					this.audioPlayerData.user = this.sessionData.current.id;
					this.audioPlayerData.username = this.sessionData.current.username;
					this.audioPlayerData.location = 'user';
					this.audioPlayerData.type = 'default';
					this.audioPlayerData.selectedIndex = 0;
				}
			});
	}

	// Player buttons
	playTrack(type, key) {
		switch(type){
			case('item'):
				if (this.audioPlayerData.current.key == key && this.audioPlayerData.current.user == this.audioPlayerData.user
												&& this.audioPlayerData.current.type == this.audioPlayerData.type) { // Play/pause current
					if (this.audioPlayerData.playing == false) {
						this.audioPlayerData.item.playing = true;
						this.audioPlayerData.list[key].playing = true;
						this.audioPlayerData.playing = true;
						this.audio.play();
					} else {
						this.audioPlayerData.item.playing = false;
						this.audioPlayerData.list[key].playing = false;
						this.audioPlayerData.playing = false;
						this.audio.pause();
					}
				} else { // Play new one
					if (!this.audioPlayerData.equalizerInitialized) {
						this.audioPlayerData.equalizerInitialized = true;
						this.initEqualizer();
					}

					this.playTrack('stop', null);
					this.audioPlayerData.current.initialized = true;

					for (let i in this.audioPlayerData.list)
						this.audioPlayerData.list[i].playing = false;

					this.audioPlayerData.list[key].playing = true;
					this.audioPlayerData.loadingToPlay = true;
					this.audioPlayerData.playing = true;
					this.audioPlayerData.current.user = this.audioPlayerData.user;
					this.audioPlayerData.current.type = this.audioPlayerData.type;
					this.audioPlayerData.current.key = key;
					this.audioPlayerData.current.item = this.audioPlayerData.list[key];
					this.audioPlayerData.current.original_artist = this.audioPlayerData.list[key].original_artist ? this.audioPlayerData.list[key].original_artist : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.original_title = this.audioPlayerData.list[key].original_title ? this.audioPlayerData.list[key].original_title : this.audioPlayerData.list[key].title;
					this.audioPlayerData.current.duration = this.audioPlayerData.list[key].duration;
					this.audioPlayerData.current.image = this.audioPlayerData.list[key].image ? (this.audioPlayerData.path + "thumbnails/" + this.audioPlayerData.list[key].image) : '';
					this.audio.src = this.audioPlayerData.path + this.audioPlayerData.list[key].name;
					this.audio.load();
					this.getColorFromAudioCover(this.audioPlayerData.current.image);

					// Replays +1
					this.updateReplays(this.audioPlayerData.list[key].song, this.sessionData.current.id);

					// Set current track
					this.audioPlayerData.location = this.audioPlayerData.location ? this.audioPlayerData.location : 'user';
					this.audioPlayerData.item = this.audioPlayerData.list[key];
					this.audioPlayerData.list = this.audioPlayerData.list;
					this.audioPlayerData.key = key;
					this.audioPlayerData.postId = this.audioPlayerData.postId;
					this.audioPlayerData.type = this.audioPlayerData.type;
					this.audioPlayerData.user = this.audioPlayerData.user;
					this.audioPlayerData.username = this.audioPlayerData.username;
					this.audioPlayerData.selectedIndex = this.audioPlayerData.selectedIndex;
				}

				// Set to service
				this.playerService.setCurrentTrack(this.audioPlayerData);

				// Set to session
				this.sessionData.current.listInformation = this.audioPlayerData;
				this.userDataService.setSessionData('data', this.sessionData);
			break;
			case('play'):
				this.playTrack('item', this.audioPlayerData.current.key);
			break;
			case('playing'):
				this.audioPlayerData.list[key].playing = true;
				this.audioPlayerData.playing = true;
				this.audio.play();
			break;
			case('pause'):
				this.audioPlayerData.list[key].playing = false;
				this.audioPlayerData.playing = false;
				this.audio.pause();
			break;
			case('prev'):
				let prevKey;

				if (this.audioPlayerData.shuffle)
					prevKey = Math.floor(Math.random() * this.audioPlayerData.list.length) + 0;
				else
					prevKey = (this.audioPlayerData.current.key == 0) ? (this.audioPlayerData.list.length - 1) : (this.audioPlayerData.current.key - 1);

				// Check if is ad item
				if (this.audioPlayerData.list[prevKey].contentTypeAd)
					prevKey = prevKey - 1;

				this.playTrack('item', prevKey);
			break;
			case('next'):
				let nextKey;

				if (this.audioPlayerData.shuffle)
					nextKey = Math.floor(Math.random() * this.audioPlayerData.list.length) + 0;
				else
					nextKey = (this.audioPlayerData.current.key == this.audioPlayerData.list.length - 1) ? 0 : (this.audioPlayerData.current.key + 1);

				// Check if is ad item
				if (this.audioPlayerData.list[nextKey].contentTypeAd)
					nextKey = nextKey + 1;

				this.playTrack('item', nextKey);
			break;
			case('stop'):
				this.audio.pause();
				this.audio.currentTime = 0;
			break;
			case('shuffle'):
				this.audioPlayerData.shuffle = !this.audioPlayerData.shuffle;
			break;
			case('repeat'):
				this.audioPlayerData.repeat = !this.audioPlayerData.repeat;
			break;
		}
	}

	// Replays +1
	updateReplays(id, user){
		let data = {
			id: id,
			user: user
		}

		this.audioDataService.updateReplays(data).subscribe();
	}

	// Audio player on background screen
	updateMetadata(){
		navigator.mediaSession.metadata = new MediaMetadata({
			title: this.audioPlayerData.current.original_title,
			artist: this.audioPlayerData.current.original_artist,
			artwork: [
				{
					src: this.audioPlayerData.current.image
				}
			]
		});
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

	// Progress bar
	progressBar(event){
		let time = ((event.value / 1000) * this.audio.duration);
		this.audio.currentTime = time;
	}

	// Volume bar
	volumeBar(type, event){
		if (type == 'progress') {
			this.audioPlayerData.volume.mute = (event.value === 0) ? true : false;
			this.audio.volume = event.value / 100;
			this.audioPlayerData.volume.value = event.value;
		} else if (type == 'save') {
			if (event.value > 1)
				this.audioPlayerData.volume.beforeMuteValue = event.value;
		} else if (type == 'mute') {
			this.audioPlayerData.volume.mute = !this.audioPlayerData.volume.mute;
			this.audioPlayerData.volume.value = this.audioPlayerData.volume.mute ? 0 : this.audioPlayerData.volume.beforeMuteValue;
			this.audio.volume = this.audioPlayerData.volume.mute ? 0 : (this.audioPlayerData.volume.beforeMuteValue / 100);
		}
	}

	// Equalizer
	initEqualizer(){
		if ('AudioContext' in window) {
			let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height, gradient;
			context = new AudioContext();
			analyser = context.createAnalyser();
			canvas = document.getElementById('audioAnalyser');
			ctx = canvas.getContext('2d');

			gradient = ctx.createLinearGradient(0, 0, 0, 1);
			gradient.addColorStop(1, 'rgb(158,158,158)');
			// gradient.addColorStop(0.25, 'rgba(0,0,0,0.15)');
			source = context.createMediaElementSource(this.audio);
			source.connect(analyser);
			analyser.connect(context.destination);

			let frameLooper = function(){
				// window.webkitRequestAnimationFrame(frameLooper);
				window.requestAnimationFrame(frameLooper);
				fbc_array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(fbc_array);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = gradient; // Color of the bars
				bars = 100;
				for (let i = 0; i < bars; i++) {
					bar_x = i * 3;
					bar_width = 2;
					bar_height = -(fbc_array[i] / 2);
					ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
				}
			}

			frameLooper();
		}
	}

	// Item options: add/remove, share, search, report
	itemAudiosOptions(type, item, playlist){
		switch(type){
			case("addRemoveSession"):
				item.type = item.addRemoveSession ? "add" : "remove";

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
				item.type = !item.addRemoveUser ? "add" : "remove";

				let dataARO = {
					user: this.sessionData.current.id,
					type: item.type,
					location: 'user',
					id: item.insertedId,
					item: item.song
				}

				this.audioDataService.addRemove(dataARO)
					.subscribe(res => {
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
				this.location.go(this.router.url + '#NewPlaylist');

				let config = {
					disableClose: false,
					data: {
						type: 'create',
						user: this.sessionData.current
					}
				}

				let dialogRef = this.dialog.open( AudiosNewPlaylistComponent, config);
				dialogRef.afterClosed().subscribe((res: any) => {
					this.location.go(this.router.url);

					if (res){
						this.sessionData.current.playlists.unshift(res);
						this.sessionData = this.userDataService.setSessionData('update', this.sessionData.current);
						this.sessionService.setDataPlaylists(this.sessionData);
						this.alertService.success('Created successfully');
					}
				});
			break;
			case("share"):
				alert("Working on Share with friends");
			break;
			case("report"):
				alert("Working on Report");
			break;
		}
	}

	// Get color
	getColorFromAudioCover(image){
		let self = this;

		if(image){
			var img = document.createElement('img');
				img.setAttribute('src', image);
			var vibrant = new Vibrant(img);
			var swatches = vibrant.swatches();

			for (var swatch in swatches)
				if (swatches.hasOwnProperty(swatch) && swatches[swatch])
					if (swatch == 'Vibrant')
						self.audioPlayerData.current.color = swatches[swatch].getHex();
		} else {
			self.audioPlayerData.current.color = null;
		}
	}

	// Show Player on Mobile
	showPlayerMobile(type){
		let data = {
			sessionData: this.sessionData,
			translations: this.translations,
			audio: this.audio,
			data: this.audioPlayerData
		}

		// Show palyer
		this.audioPlayerMobileService.show(data);
	}

	// Show playlist web
	showPlaylistWeb(){
		this.showUserBox = false;
		this.showPlaylist = !this.showPlaylist;
	}

	// Show userBox web
	showUserBoxWeb(){
		this.showUserBox = !this.showUserBox;
		this.showCloseSession = false; 
		this.showChangeSession = false; 
		this.showChangeLanguage = false;
		this.showPlaylist = false;
	}

	// Show panel from bottom on mobile
	showSessionPanelFromBottomOnMobile(){
		this.showPlayer = false;

		// Config
		let config = {
			data: {
				sessionData: this.sessionData
			}
		}

		// Set sheet
		let bottomSheetRef = this.bottomSheet.open(SessionPanelMobileComponent, config);

		// Dismiss and return value
		bottomSheetRef.afterDismissed().subscribe(val => {
			// no dismiss actions
		});
	}

	// Add another session
	openNewSession(){
		this.location.go(this.router.url + '#AddAccount');

		let config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations
			}
		}

		let dialogRef = this.dialog.open( SettingsSessionComponent, config);
		dialogRef.afterClosed().subscribe((res: string) => {
			this.location.go(this.router.url);

			if (res) {
				this.sessionData.sessions.push(res);
				this.setCurrentUser(res);
			}
		});
	}

	// Set session
	setCurrentUser(data){
		if (this.sessionData.current.id != data.id) {
			// Set data
			this.scrollTop();
			this.sessionData.current = data;
			this.sessionService.setData(this.sessionData);
			this.userDataService.setSessionData('data', this.sessionData);
			this.showSessions = false;
			this.showChangeSessionOnMenu = false;

			// Get translations
			// this.getTranslations(data.language);

			// Go to main page
			this.router.navigate([data.username]);

			// Alert message
			this.alertService.success(this.translations.accountChangedTo + ' @' + data.username);
		}
	}

	// Close session
	closeSession(data){
		if (this.sessionData.sessions.length == 1) {
			this.document.body.classList.remove('darkTheme');
			this.router.navigate(['signin']);
		} else {
			for (var i in this.sessionData.sessions)
				if (this.sessionData.sessions[i].id == data.id)
					this.sessionData.sessions.splice(i, 1);

			this.sessionData.current = this.sessionData.sessions[0];
			this.setCurrentUser(this.sessionData.current);
		}
	}

	// Dark theme
	darkTheme(){
		this.sessionData.current.theme = !this.sessionData.current.theme;

		if (this.sessionData.current.theme)
			this.document.body.classList.add('darkTheme');
		else
			this.document.body.classList.remove('darkTheme');

		let data = {
			id: this.sessionData.current.id,
			theme: this.sessionData.current.theme
		}

		this.userDataService.updateTheme(data)
			.subscribe(res => {
				setTimeout(() => {
					this.sessionData = this.userDataService.getSessionData();
					this.sessionService.setDataTheme(this.sessionData);

					if (this.sessionData.current.theme)
						this.alertService.success('Dark theme enabled');
					else
						this.alertService.success('Dark theme disabled');
				}, 1000);
			}, error => {
				this.alertService.error('An error has ocurred');
			});
	}

	// Change language
	changeLanguage(lang){
		// Get translations
		this.getTranslations(lang.id);

		// Set data
		this.sessionData.current.language = lang.id;
		this.sessionService.setData(this.sessionData);
	}

	// Report inapropiate content
	openReport(data){
		this.location.go(this.router.url + '#report');

		if (data.type == 'publication') {
		} else if (data.type == 'publicationComment') {
		} else if (data.type == 'photo') {
		} else if (data.type == 'photoComment') {
		} else if (data.type == 'audio') {
		} else if (data.type == 'audioPlaylist') {
		} else if (data.type == 'chat') {
		}

		console.log("openReport:", data);

		let config = {
			disableClose: false,
			data: {
				item: data
			}
		}

		let dialogRef = this.dialog.open(ReportComponent, config);
		dialogRef.afterClosed().subscribe((res: string) => {
			this.location.go(this.router.url);
		});
	}
}

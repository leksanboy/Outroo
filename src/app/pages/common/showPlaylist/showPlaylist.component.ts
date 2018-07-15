import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { SessionService } from '../../../../app/core/services/session/session.service';

@Component({
	selector: 'app-showPlaylist',
	templateUrl: './showPlaylist.component.html'
})
export class ShowPlaylistComponent implements OnInit {
	public environment: any = environment;
	public sessionData: any = [];
	public audioPlayerData: any = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowPlaylistComponent>,
		private alertService: AlertService,
		private playerService: PlayerService,
		private sessionService: SessionService,
		private audioDataService: AudioDataService
	) {
		this.data.list = [];
		this.data.loadingData = true;
		this.data.noData = false;
		this.sessionData = data.sessionData;
	}

	ngOnInit() {
		let dataP = {
			id: this.data.item.id
		}

		this.audioDataService.defaultPlaylistSongs(dataP)
			.subscribe(res => {
				this.data.loadingData = false;

				if (res.length == 0) {
					this.data.noData = true;
				} else {
					this.data.noData = false;
					this.data.list = res;
				}
			});


		// Get player data
		this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});
	}

	// Play item song
	playItem(data, item, key, type) {
		if (this.audioPlayerData.key == key && this.audioPlayerData.type == type && this.audioPlayerData.item.song == item.song) { // Play/Pause current
			item.playing = !item.playing;
			this.data.playing = !this.data.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.list = data;
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			this.audioPlayerData.user = this.data.userData.id;
			this.audioPlayerData.username = this.data.userData.username;
			this.audioPlayerData.location = 'playlist';
			this.audioPlayerData.type = type;
			this.audioPlayerData.selectedIndex = this.data.selectedIndex;

			item.playing = true;
			this.data.playing = true;
			this.playerService.setData(this.audioPlayerData);
		}
	}

	// Play/Pause
	playTrack(type) {
		if (type == 'play') {
			this.playItem(
				this.data.list, 
				(this.audioPlayerData.item ? this.audioPlayerData.item : this.data.list[0]), 
				(this.audioPlayerData.key ? this.audioPlayerData.key : 0), 
				'default');
		} else if (type == 'prev') {
			let prevKey = (this.audioPlayerData.key == 0) ? (this.data.list.length - 1) : (this.audioPlayerData.key - 1);
			this.audioPlayerData.key = prevKey;
			this.playerService.setData(this.audioPlayerData);
		} else if (type == 'next') {
			let nextKey = (this.audioPlayerData.key == this.data.list.length - 1) ? 0 : (this.audioPlayerData.key + 1);
			this.audioPlayerData.key = nextKey;
			this.playerService.setData(this.audioPlayerData);
		}
	}

	// Item options
	itemOptions(type, item, playlist){
		switch(type){
			case("addRemoveSession"):
				item.removeType = item.addRemoveSession ? "add" : "remove";
				
				let dataARS = {
					user: this.data.sessionData.current.id,
					type: item.removeType,
					subtype: 'session',
					location: 'playlist',
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
				item.removeType = !item.addRemoveUser ? "add" : "remove";
				
				let dataARO = {
					user: this.data.sessionData.current.id,
					type: item.removeType,
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
				item.removeType = !item.addRemoveUser ? "add" : "remove";
				
				let dataP = {
					user: this.data.sessionData.current.id,
					type: item.removeType,
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
			case("report"):
				item.type = 'playlist';
				this.sessionService.setDataReport(item);
			break;
		}
	}

	// Close
	close(){
		this.dialogRef.close();
	}
}

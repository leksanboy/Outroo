import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';

import { AlertService } from '../../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../../app/core/services/session/session.service';
import { AudioDataService } from '../../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../../app/core/services/player/player.service';
import { PublicationsDataService } from '../../../../../app/core/services/user/publicationsData.service';
import { NotificationsDataService } from '../../../../../app/core/services/user/notificationsData.service';

import { TimeagoPipe } from '../../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../../app/core/pipes/safehtml.pipe';

@Component({
	selector: 'app-showPublication',
	templateUrl: './showPublication.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class MainShowPublicationComponent implements OnInit {
	@ViewChild('videoPlayer') videoPlayer: any;
	public environment: any = environment;
	public sessionData: any = [];
	public audioPlayerData: any = [];
	public noData: boolean;
	public loadingData: boolean;
	public loadMoreData: boolean;
	public loadingMoreData: boolean;
	public rowsComments: number;
	public notExist: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<MainShowPublicationComponent>,
		private location: Location,
    	private _fb: FormBuilder,
    	private alertService: AlertService,
    	private sessionService: SessionService,
    	private audioDataService: AudioDataService,
    	private playerService: PlayerService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		this.data.current = this.data.item ? this.data.item : [];
		this.data.user = this.data.user ? this.data.user : [];
		this.sessionData = this.data.sessionData;
		this.data.comments = {
			new: '',
			list: []
		};

		if (this.data.item) {
			// Check if exists
    		this.notExist = false;

	    	// Set comment clear
	    	this.newComment('clear');

	    	// Check if publication is liked
	    	this.checkLike();

	    	// Load comments
	    	this.defaultComments('default', this.data.current.id);

	    	// Update replays
	    	this.updateReplays(this.data.current.id, this.data.session.id);
    	} else {
    		// Check if exists
    		this.notExist = true;
    	}
	}

	ngOnInit() {
		// no init
	}

    // Replays +1
	updateReplays(id, user) {
		let data = {
			id: id,
			user: user
		}

		this.publicationsDataService.updateReplays(data).subscribe();
	}

    // Comments
	defaultComments(type, id) {
		if (type == 'default') {
			this.noData = false;
			this.loadMoreData = false;
			this.loadingData = true;
			this.data.comments.new = '';
			this.data.comments.list = [];
			this.rowsComments = 0;

			let data = {
				id: id,
				rows: 0,
				cuantity: environment.cuantity
			}

			this.publicationsDataService.comments(data)
				.subscribe(res => {
					setTimeout(() => {
						this.loadingData = false;

						if (res.length == 0) {
							this.noData = true;
						} else {
							this.loadMoreData = (res.length < environment.cuantity) ? false : true;
							this.noData = false;
							this.data.comments.list = res;
						}
					}, 300);
				});
		} else if (type == 'more') {
			this.loadingMoreData = true;
			this.rowsComments++;

			let data = {
				id: this.data.current.id,
				rows: this.rowsComments,
				cuantity: environment.cuantity
			}

			this.publicationsDataService.comments(data)
				.subscribe(res => {
					setTimeout(() => {
						this.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.loadingMoreData = false;

						for (let i in res)
							this.data.comments.list.push(res[i]);
					}, 300);
				});
		}
	}

	// Like / Unlike
	likeUnlike(item){
		if (item.liked) {
			item.liked = false;
			item.countLikes--;

			for (let i in item.likers) {
				if (item.likers[i].id == this.data.session.id)
					item.likers.splice(i, 1);
			}
		} else {
			item.liked = true;
			item.countLikes++;

			item.likers.unshift(this.data.session);
		}

		// data
		let data = {
			publication: item.id,
			user: this.data.session.id,
			type: item.liked ? 'like' : 'unlike'
		}

		this.publicationsDataService.likeUnlike(data).subscribe();
	}

	// Check like
	checkLike(){
		let data = {
			id: this.data.current.id,
			user: this.data.session.id
		}

		this.publicationsDataService.checkLike(data)
			.subscribe(res => {
				this.data.current.liked = res.liked;
				this.data.current.likers = res.likers;
			});
	}

	// New comment
	newComment(type){
		switch (type) {
			case 'clear':
				this.data.current.newComment = '';
				break;
			case 'create':
				let dataCreate = {
					type: 'create',
					user: this.data.session.id,
					publication: this.data.current.id,
					comment: this.data.current.newComment
				}

				this.publicationsDataService.comment(dataCreate)
					.subscribe((res: any) => {
						res = res.json();
						this.data.comments.list.unshift(res);
						this.data.current.countComments++;
						this.newComment('clear');
						this.noData = false;
					});
				break;
		}
	}

	// Item Options
	itemOptions(type, item){
		switch (type) {
			case "remove":
				item.typeRemove = item.addRemoveSession ? "add" : "remove";

				let dataAddRemove = {
					id: item.id,
					type: item.typeRemove,
					user: this.data.session.id
				}

				this.publicationsDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "disableComments":
				item.disabledComments = !item.disabledComments;

				let dataDisableComments = {
					id: item.id,
					type: item.disabledComments,
					user: this.data.session.id
				}

				this.publicationsDataService.enableDisableComments(dataDisableComments).subscribe();
				break;
			case "share":
				alert("Working on Share");
				break;
			case "report":
				alert("Working on Report");
				break;
			case "close":
				this.dialogRef.close();
				break;
			case "closeUser":
				this.dialogRef.close(item);
				break;
		}
	}

	// Comments Options
	commentsOptions(type, data, index){
		switch (type) {
			case "remove":
				let dataRemove = {
					type: 'remove',
					user: this.data.session.id,
					id: data.id
				}

				this.publicationsDataService.comment(dataRemove)
					.subscribe((res: any) => {
						this.data.current.countComments--;
						this.data.comments.list.splice(index, 1);
					});
				break;
			case "report":
				alert("Working on Report");
				break;
		}
	}

	// Play item song
	playItem(data, item, key, type) {
		if (this.audioPlayerData.key == key && this.audioPlayerData.type == type && this.audioPlayerData.postId == data.id) { // Play/Pause current
			item.playing = !item.playing;
			this.playerService.setPlayTrack(this.audioPlayerData);
		} else { // Play new one
			this.audioPlayerData.postId = data.id;
			this.audioPlayerData.list = data.audios;
			this.audioPlayerData.item = item;
			this.audioPlayerData.key = key;
			this.audioPlayerData.user = this.data.current.id;
			this.audioPlayerData.username = this.data.current.username;
			this.audioPlayerData.location = 'user';
			this.audioPlayerData.type = type;

			item.playing = true;
			this.playerService.setData(this.audioPlayerData);
		}
	}

	// Item options: add/remove, share, search, report
	itemAudiosOptions(type, item, playlist){
		switch(type){
			case("addRemoveUser"):
				item.type = !item.addRemoveUser ? "add" : "remove";

				let dataOther = {
					user: this.data.session.id,
					type: item.type,
					location: 'user',
					id: item.insertedId,
					song: item.id
				}

				this.audioDataService.addRemove(dataOther)
					.subscribe((res: any) => {
						item.insertedId = res.json();
					});
			break;
			case("playlist"):
				item.type = !item.addRemoveUser ? "add" : "remove";

				let dataP = {
					user: this.data.session.id,
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
			case("share"):
				alert("Working on Share with friends");
			break;
			case("search"):
				alert("Working on Search similars");
			break;
			case("report"):
				alert("Working on Report");
			break;
		}
	}
}

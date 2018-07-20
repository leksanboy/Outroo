import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

@Component({
	selector: 'app-showPublication',
	templateUrl: './showPublication.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class ShowPublicationComponent implements OnInit {
	@ViewChild('videoPlayer') videoPlayer: any;
	public environment: any = environment;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public notExists: boolean;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;
	public audioPlayerData: any = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowPublicationComponent>,
		private location: Location,
    	private _fb: FormBuilder,
    	private alertService: AlertService,
    	private sessionService: SessionService,
    	private audioDataService: AudioDataService,
    	private playerService: PlayerService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		this.translations = data.translations;
		this.sessionData = data.sessionData;
		this.userData = data.userData;
		this.data.current = data.item ? data.item : [];

		console.log("this.translations", data);

		if (this.data.item) {
			// Check if exists
    		this.notExists = false;

	    	// Check if publication is liked
	    	this.checkLike(this.data.current.id, this.sessionData.current.id);

	    	// Update replays
	    	this.updateReplays(this.data.current.id, this.sessionData.current.id);

	    	// Load comments
	    	this.defaultComments('default', this.data.current);
    	} else {
    		// Check if exists
    		this.notExists = true;
    	}
	}

	ngOnInit() {
		// not in use
	}

    // Replays +1
	updateReplays(id, user) {
		let data = {
			id: id,
			user: user
		}

		this.publicationsDataService.updateReplays(data).subscribe();
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
	checkLike(id, user){
		let data = {
			id: id,
			user: user
		}

		this.publicationsDataService.checkLike(data)
			.subscribe(res => {
				this.data.current.liked = res.liked;
				this.data.current.likers = res.likers;
			});
	}

	// Item Options
	itemOptions(type, item){
		switch (type) {
			case "remove":
				item.typeRemove = item.addRemoveSession ? "add" : "remove";

				let dataAddRemove = {
					id: item.id,
					type: item.typeRemove,
					user: this.sessionData.current.id
				}

				this.publicationsDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "disableComments":
				item.disabledComments = !item.disabledComments;

				let dataDisableComments = {
					id: item.id,
					type: item.disabledComments,
					user: this.sessionData.current.id
				}

				this.publicationsDataService.enableDisableComments(dataDisableComments).subscribe();
				break;
			case "report":
				item.type = 'photo';
				this.sessionService.setDataReport(item);
				break;
			case "close":
				this.dialogRef.close();
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

	// Item audios options
	itemAudiosOptions(type, item, playlist){
		switch(type){
			case("addRemoveUser"):
				item.removeType = !item.addRemoveUser ? "add" : "remove";

				let dataOther = {
					user: this.data.session.id,
					type: item.removeType,
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
				item.removeType = !item.addRemoveUser ? "add" : "remove";

				let dataP = {
					user: this.data.session.id,
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

	// Show/hide comments box
	showComments(type, item){
		switch (type) {
			case "showHide":
				item.showCommentsBox = !item.showCommentsBox;
				break;
		}
	}

	// Comments
	defaultComments(type, item) {
		if (type == 'default') {
			item.noData = false;
			item.loadMoreData = false;
			item.loadingData = true;
			item.comments = [];
			item.comments.list = [];
			item.rowsComments = 0;

			// New comments set
			this.newComment('clear', null, item);

			// Data
			let data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.comments(data)
				.subscribe(res => {
					item.loadingData = false;

					if (!res || res.length == 0) {
						item.noData = true;
					} else {
						item.noData = false;
						item.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						item.comments.list = res;
					}
				}, error => {
					item.loadingData = false;
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more') {
			item.loadingMoreData = true;
			item.rowsComments++;

			let data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.comments(data)
				.subscribe(res => {
					setTimeout(() => {
						item.loadingMoreData = false;
						item.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;

						if (!res || res.length == 0)
							for (let i in res)
								item.comments.list.push(res[i]);
					}, 600);
				}, error => {
					item.loadingData = false;
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		}
	}

	// New comment
	newComment(type, event, item){
		if (type == 'clear') {
			item.newCommentData = [];

			setTimeout(() => {
				item.newCommentData = {
					original: '',
					transformed: '',
					onBackground: '',
					eventTarget: '',
					lastTypedWord: []
				};

				this.newComment('checkPlaceholder', null, item);
			}, 100);
		} else if (type == 'writingChanges') {
			let str = event;
			item.newCommentData.original = event;
			
			// new line
			str = str.replace(/\n/g, '<br>');

			// hashtag
			str = str.replace(/(#)\w+/g, function(value){
				return '<span class="hashtag">' + value + '</span>';
			});

			// mention
			str = str.replace(/(@)\w+/g, function(value){
				return '<span class="mention">' + value + '</span>';
			});

			// url
			str = str.replace(this.urlRegex, function(value){
				return '<span class="url">' + value + '</span>';
			});

			// writing content
			item.newCommentData.transformed = str;

			//check empty contenteditable
			this.newComment('checkPlaceholder', null, item);
		} else if (type == 'keyCode') {
			if (event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 27) {
				// Space, Enter, Escape
				this.searchBoxMentions = false;
			} else {
				if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
					this.searchBoxMentions = false;
				} else {
					item.newCommentData.eventTarget = event.target;
					let position = this.getCaretPosition(event.target);
					let word = this.getCurrentWord(event.target, position);
					
					item.newCommentData.lastTypedWord = {
						word: word,
						position: position
					};
				}
			}
		} else if (type == 'checkPlaceholder') {
			if (item.newCommentData.original.length == 0)
				item.newCommentData.transformed = '<div class="placeholder">' + this.translations.whatsHappening.one + '</div>';
		} else if (type == 'transformBeforeSend') {
			let newData = {
				content: item.newCommentData.original ? item.newCommentData.original : '',
				original: item.newCommentData.original ? item.newCommentData.original : '',
				mentions: [],
				hashtags: []
			}

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function(value){
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function(value){
				newData.mentions.push(value);
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.urlRegex, function(value){
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		} else if (type == 'create') {
			if (item.newCommentData.original.trim().length == 0) {
				this.alertService.success(this.translations.commentIsTooShort);
			} else {
				let formatedData = this.newComment('transformBeforeSend', null, item);
				let dataCreate = {
					type: 'create',
					id: item.id,
					sender: this.sessionData.current.id,
					receiver: this.userData.id,
					comment: formatedData.content,
					comment_original: formatedData.original,
					mentions: formatedData.mentions
				}

				this.publicationsDataService.comment(dataCreate)
					.subscribe((res: any) => {
						item.comments.list.unshift(res);
						item.countComments++;
						item.noData = false;

						this.newComment('clear', null, item);
					}, error => {
						this.alertService.success(this.translations.anErrorHasOcurred);
					});
			}
		}
	}

	// Comments Options
	commentsOptions(type, item, comment){
		switch (type) {
			case "addRemove":
				comment.addRemove = !comment.addRemove;
				comment.type = !comment.addRemove ? "add" : "remove";

				let data = {
					sender: this.sessionData.current.id,
					receiver: this.userData.id,
					type: comment.type,
					comment: comment.id,
					id: item.id
				}

				this.publicationsDataService.comment(data)
					.subscribe((res: any) => {
						if (comment.addRemove)
							item.countComments--;
						else
							item.countComments++;
					});
				break;
			case "report":
				item.type = 'photoComment';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Caret position on contenteditable
	getCaretPosition(element) {
		let w3 = (typeof window.getSelection != "undefined") && true,
			caretOffset = 0;

		if (w3) {
			let range = window.getSelection().getRangeAt(0);
			let preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		} else {
			this.alertService.error(this.translations.tryToUseAnotherBrowser);
		}

		return caretOffset;
	}

	// Get current typing word on contenteditable
	getCurrentWord(el, position) {
		let word = '';

		// Get content of div
		let content = el.textContent;

		// Check if clicked at the end of word
		position = content[position] === ' ' ? position - 1 : position;

		// Get the start and end index
		let startPosition = content.lastIndexOf(' ', position);
		startPosition = startPosition === content.length ? 0 : startPosition;
		let endPosition = content.indexOf(' ', position);
		endPosition = endPosition === -1 ? content.length : endPosition;

		return content.substring(startPosition + 1, endPosition);
	}

	// Close
	close(){
		this.dialogRef.close();
	}
}

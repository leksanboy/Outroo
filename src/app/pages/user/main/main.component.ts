import { DOCUMENT } from '@angular/platform-browser';
import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy, Inject, ElementRef, Renderer } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';
import { BookmarksDataService } from '../../../../app/core/services/user/bookmarksData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { MetaService } from '../../../../app/core/services/meta/meta.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

import { NewPublicationComponent } from '../../../../app/pages/common/newPublication/newPublication.component';
import { ShowAvatarComponent } from '../../../../app/pages/common/showAvatar/showAvatar.component';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class MainComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public swiperConfig: any = {
		pagination: '.swiper-pagination',
		nextButton: '.swiperNext',
		prevButton: '.swiperPrev',
		paginationClickable: true,
		spaceBetween: 0
	};
	public activeRouter: any;
	public activePlayerInformation: any;
	public activeLanguage: any;
	public activeRouterExists: any;
	public activeSession: any;
	public activeSessionPlaylists: any;
	public userExists: boolean = true;
	public data: any;
	public dataDefault: any;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		public dialog: MatDialog,
		private router: Router,
		private location: Location,
		private renderer: Renderer,
		private elementRef: ElementRef,
		private metaService: MetaService,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private followsDataService: FollowsDataService,
		private bookmarksDataService: BookmarksDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		//////////
		// META //
		//////////
		console.log("constructor", new Date());

		// Get url data
		let urlData: any = this.activatedRoute.snapshot.params.id;
		
		// Get user data
		this.siteUserData(urlData);

		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Check if session exists
		if (!this.sessionData) {
			this.sessionData = [];
			this.sessionData.current = {
				id: null
			};
		}

		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					// Run page on routing
					this.activeRouterExists = true;

					// Go top of page on change user
					window.scrollTo(0, 0);

					// Get url data
					let urlData: any = this.activatedRoute.snapshot.params.id;

					// Set visual data page if session equals user
					if (urlData == this.sessionData.current.username)
						this.userData = this.sessionData.current;

					// Get user data
					this.siteUserData(urlData);

					// Load default
					this.default('default', urlData, this.sessionData.current.id);
				}
			});

		// Multiples sessions: select one and refresh session data
		this.activeSession = this.sessionService.getData()
			.subscribe(data => {
				this.sessionData = data;

				// Get translations
				this.getTranslations(data.current.language);

				// Change url whitout reloading
				this.location.go('/' + data.current.username);

				// Get user data
				this.siteUserData(data.current.username);

				// Load default
				this.default('default', data.current.username, this.sessionData.current.id);
			});

		// Session playlists
		this.activeSessionPlaylists = this.sessionService.getDataPlaylists()
			.subscribe(data => {
				this.sessionData = data;
			});

		// Get current track
		this.activePlayerInformation = this.playerService.getCurrentTrack()
			.subscribe(data => {
				this.audioPlayerData = data;
			});

		// Get language
		this.activeLanguage = this.sessionService.getDataLanguage()
			.subscribe(data => {
				let lang = data.current.language;
				this.getTranslations(lang);
			});

		// Close all dialogs
		this.dialog.closeAll();

		// Click on a href
		this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
			if (event.target.localName == 'a')
				this.sessionService.setDataClickElementRef(event);
		});

		// Load more on scroll on bottom
		window.onscroll = (event) => {
			let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			let body = document.body, html = document.documentElement;
			let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			let windowBottom = windowHeight + window.pageYOffset;

			if (windowBottom >= docHeight)
				if (this.dataDefault.list.length > 0)
					this.default('more', null, null);
		}
	}

	ngOnInit() {
		// Run page on reload page
		if (!this.activeRouterExists) {
			// Get url data
			let urlData: any = this.activatedRoute.snapshot.params.id;

			// Set visual data page if session equals user
			if (this.sessionData.current)
				if (urlData == this.sessionData.current.username)
					this.userData = this.sessionData.current;

			// Get user data
			this.siteUserData(urlData);

			// Load default
			this.default('default', urlData, this.sessionData.current.id);
		}
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeSession.unsubscribe();
		this.activeSessionPlaylists.unsubscribe();
		this.activePlayerInformation.unsubscribe();
		this.activeLanguage.unsubscribe();
	}

	// User data of the page
	siteUserData(id){
		this.userDataService.getUserData(id)
			.subscribe(res => {
				console.log("siteUserData", res);
				console.log("siteUserData", new Date());

				if (res) {
					this.userExists = true;
					this.userData = res;

					// Update user data if im the user
					if (this.userData.id == this.sessionData.current.id)
						this.sessionData = this.userDataService.setSessionData('update', res);

					// Meta data
					let title = this.userData.name + ' (@'+this.userData.username+')';
					let metaData = {
						page: title,
						title: title,
						description: this.userData.aboutOriginal,
						keywords: this.userData.aboutOriginal,
						url: this.environment.url + this.userData.username,
						image: this.environment.url + (this.userData.avatar ? this.userData.avatarUrl : this.environment.avatar)
					}

					// Call metaService
					this.metaService.setData(metaData);

					// Set Google analytics
					let urlGa =  '[' + this.userData.id + ']/' + id + '/main';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Data following/visitor
					let data = {
						sender: this.sessionData ? this.sessionData.current.id : 0,
						receiver: this.userData.id
					}

					// Check if following
					if (this.sessionData) {
						this.followsDataService.checkFollowing(data)
							.subscribe(res => {
								this.userData.status = res;
							});
					}

					// Set visitor
					this.userDataService.setVisitor(data).subscribe();
				} else {
					this.userExists = false;
					this.userData = [];
					this.userData.username = id;
				}

				// Set location init
				this.location.go('/' + this.userData.username);
			});
	}

	// Follow / Unfollow
	followUnfollow(type, user){
		if (type == 'follow')
			user.status = user.private ? 'pending' : 'following';
		else if (type == 'unfollow')
			user.status = 'unfollow';

		let data = {
			type: user.status,
			private: user.private,
			sender: this.sessionData.current.id,
			receiver: user.id
		}

		this.followsDataService.followUnfollow(data).subscribe();
	}

	// Show user images
	showAvatar(){
		this.location.go('/' + this.userData.username + '#avatar');

		// config
		let config = {
			disableClose: false,
			data: {
				userData: this.userData,
				translations: this.translations
			}
		};

		let dialogRef = this.dialog.open(ShowAvatarComponent, config);
		dialogRef.afterClosed().subscribe((res: any) => {
			this.location.go('/' + this.userData.username);
		});
	}

	// New publication
	newPublication(){
		this.location.go('/' + this.sessionData.current.username + '#newPublication');

		let config = {
			disableClose: false,
			data: {
				sessionData: this.sessionData,
				translations: this.translations
			}
		};

		let dialogRef = this.dialog.open(NewPublicationComponent, config);
		dialogRef.afterClosed().subscribe((res: any) => {
			this.location.go('/' + this.sessionData.current.username);

			if (res){
				this.dataDefault.list.unshift(res);
				this.dataDefault.noData = false;
			}
		});
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Play video
    playVideo(item, player){
    	player = document.getElementById(player);
    	player.load();
    	player.play();
    	item.playButton = true;

    	player.addEventListener('ended', myHandler, false);

    	function myHandler(e) {
    		item.playButton = false;
	    }
    }

	// Default
	default(type, user, session) {
		if (type == 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noData: false,
				noMore: false
			}

			let data = {
				type: 'user',
				user: user,
				session: session,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length == 0) {
						this.dataDefault.noData = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.noData = false;
						this.dataDefault.list = res;
					}

					if (!res || res.length < this.environment.cuantity)
						this.dataDefault.noMore = true;
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				type: 'user',
				user: this.userData.id,
				session: this.sessionData.current.id,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								this.dataDefault.list.push(res[i]);

						if (!res || res.length < this.environment.cuantity)
							this.dataDefault.noMore = true;
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Item options
	itemOptions(type, item){
		switch (type) {
			case "remove":
				item.removeType = item.addRemoveSession ? "add" : "remove";

				let dataAddRemove = {
					id: item.id,
					type: item.removeType,
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
				item.type = 'publication';
				this.sessionService.setDataReport(item);
				break;
		}
	}

	// Share on social media
	shareOn(type, item){
		switch (type) {
			case "message":
				// If content text not exists then set YouTube/Vimeo title
				if (item.urlVideo && !item.content_original)
					item.content_original = item.urlVideo.title;

				item.comeFrom = 'share';
				this.sessionService.setDataShowConversation(item);
				break;
			case "copyLink":
				let urlExtension = item.user.name + ' ' + this.environment.url + 'showPublication?n=' + item.name;
				urlExtension.toString();
				this.sessionService.setDataCopy(urlExtension);
				break;
		}
	}

	// Play item song
	playItem(data, item, key, type) {
		if (!this.sessionData.current.id) {
		    this.alertService.success(this.translations.createAnAccountToListenSong);
		} else {
			if (this.audioPlayerData.key == key && this.audioPlayerData.type == type && this.audioPlayerData.postId == data.id) { // Play/Pause current
				item.playing = !item.playing;
				this.playerService.setPlayTrack(this.audioPlayerData);
			} else { // Play new one
				this.audioPlayerData.postId = data.id;
				this.audioPlayerData.list = data.audios;
				this.audioPlayerData.item = item;
				this.audioPlayerData.key = key;
				this.audioPlayerData.user = this.userData.id;
				this.audioPlayerData.username = this.userData.username;
				this.audioPlayerData.location = 'user';
				this.audioPlayerData.type = type;

				item.playing = true;
				this.playerService.setData(this.audioPlayerData);
			}
		}
	}

	// Item options: add/remove, share, search, report
	itemAudiosOptions(type, item, playlist){
		switch(type){
			case("addRemoveUser"):
				item.removeType = !item.addRemoveUser ? "add" : "remove";

				let dataOther = {
					user: this.sessionData.current.id,
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
					user: this.sessionData.current.id,
					type: item.removeType,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				}

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title,
							text = ' ' + this.translations.hasBeenAddedTo + ' ' + playlist.title;
						this.alertService.success(song + text);
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
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
			case("share"):
				item.comeFrom = 'share';
				this.sessionService.setDataShowConversation(item);
			break;
		}
	}

	// Bookmarks
	markUnmark(item){
		if (this.sessionData.current.id) {
			item.bookmark.checked = !item.bookmark.checked;

			// data
			let data = {
				item: item.id,
				id: item.bookmark.id,
				user: this.sessionData.current.id,
				type: item.bookmark.checked ? 'add' : 'remove'
			}

			this.bookmarksDataService.markUnmark(data)
				.subscribe(res => {
					if (res)
						item.bookmark.id = res;
				});
		}
	}

	// Like / Unlike
	likeUnlike(item){
		if (this.sessionData.current.id) {
			if (item.liked) {
				item.liked = false;
				item.countLikes--;

				for (let i in item.likers)
					if (item.likers[i].id == this.sessionData.current.id)
						item.likers.splice(i, 1);
			} else {
				item.liked = true;
				item.countLikes++;

				item.likers.unshift(this.sessionData.current);
			}

			// data
			let data = {
				id: item.id,
				sender: this.sessionData.current.id,
				receiver: item.user.id,
				type: item.liked ? 'like' : 'unlike'
			}

			this.publicationsDataService.likeUnlike(data).subscribe();
		}
	}

	// Show people who like
	showLikes(item){
		item.comeFrom = 'publication';
		this.sessionService.setDataShowLikes(item);
	}

	// Show/hide comments box
	showComments(type, item){
		switch (type) {
			case "showHide":
				item.showCommentsBox = !item.showCommentsBox;
				
				if (item.disabledComments && !item.loaded)
					this.defaultComments('default', item);
				break;
			case "load":
				this.defaultComments('default', item);
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
			item.loaded = true;

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
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !item.loadingMoreData) {
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

						// Push items
						if (!res || res.length > 0)
							for (let i in res)
								item.comments.list.push(res[i]);
					}, 600);
				}, error => {
					item.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
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
				this.alertService.warning(this.translations.commentIsTooShort);
			} else {
				let formatedData = this.newComment('transformBeforeSend', null, item);
				let dataCreate = {
					type: 'create',
					id: item.id,
					sender: this.sessionData.current.id,
					receiver: item.user.id,
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
						this.alertService.error(this.translations.anErrorHasOcurred);
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
					receiver: item.user.id,
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
				item.type = 'publicationComment';
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
}

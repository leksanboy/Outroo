import { DOCUMENT, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject, ElementRef, Renderer } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
// import 'rxjs/add/operator/filter';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData';
import { PlayerService } from '../../../../app/core/services/player/player.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class HomeComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public audioPlayerData: any = [];
	public activeRouter: any;
	public activeRouterExists: any;
	public activeSessionPlaylists: any;
	public activePlayerInformation: any;
	public hideAd: boolean;
	public data: any;
	public dataDefault: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public swiperConfig: any = {
		pagination: '.swiper-pagination',
		nextButton: '.swiperNext',
		prevButton: '.swiperPrev',
		paginationClickable: true,
		spaceBetween: 0
	};
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private location: Location,
		private renderer: Renderer,
		private titleService: Title,
		private elementRef: ElementRef,
		private alertService: AlertService,
		private playerService: PlayerService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private audioDataService: AudioDataService,
		private publicationsDataService: PublicationsDataService,
		private notificationsDataService: NotificationsDataService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Exit if no session
		if (!this.sessionData)
			this.userDataService.noSessionData();

		// Set component data
		this.activeRouter = this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd) {
					// Run page on routing
					this.activeRouterExists = true;

					// Go top of page on change user
					window.scrollTo(0, 0);

					// Set Google analytics
					let urlGa =  '[' + this.sessionData.current.id + ']/home';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Set Document title
					this.titleService.setTitle('Home');

					// Load default
					this.default('default', this.sessionData.current.id, this.sessionData.current.id);
				}
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

		// Click on a href
		this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
			if (event.target.localName == 'a') {
				if (event.target.className == 'mention') {
					let user = event.target.innerText.substring(1);
					this.router.navigate([user]);
				} else if (event.target.className == 'hashtag') {
					let hash = 'news/search=#'+ event.target.innerText.substring(1);
					this.router.navigate([hash]);
				} else if (event.target.className == 'url') {
					window.open(event.target.innerText, '_blank');
				}
			}
		});
	}

	ngOnInit() {
		// Run page on reload page
		if (!this.activeRouterExists)
			this.default('default', this.sessionData.current.id, this.sessionData.current.id);
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeSessionPlaylists.unsubscribe();
		this.activePlayerInformation.unsubscribe();
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Default
	default(type, user, session) {
		if (type == 'default') {
			this.dataDefault = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				type: 'home',
				user: user,
				session: session,
				rows: this.dataDefault.rows,
				cuantity: environment.cuantity
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (res.length == 0) {
						this.dataDefault.noData = true;
						this.dataDefault.noMore = true;
					} else {
						this.dataDefault.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataDefault.noData = false;
						this.dataDefault.list = res;

						if (res.length < environment.cuantity)
							this.dataDefault.noMore = true;
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				type: 'home',
				user: this.sessionData.current.id,
				session: this.sessionData.current.id,
				rows: this.dataDefault.rows,
				cuantity: environment.cuantity
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						if (res.length > 0) {
							// Push ad
							this.dataDefault.list.push(this.pushAd());

							// Push items
							for (let i in res)
								if (res[i].urlVideo)
									this.dataDefault.list.push(res[i]);
						}

						if (res.length < environment.cuantity)
							this.dataDefault.noMore = true;
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Item options
	itemOptions(type, item){
		switch (type) {
			case "remove":
				item.type = item.addRemoveSession ? "add" : "remove";

				let dataAddRemove = {
					id: item.id,
					type: item.type,
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
		// If content text not exists then set YouTube/Vimeo title
		if (item.urlVideo && !item.content_original)
			item.content_original = item.urlVideo.title;
		
		// Generate extension and turn to string
		let urlExtension = item.user.name + ' ' + this.environment.url + 'showPublication?n=' + item.name;
		urlExtension.toString();

		switch (type) {
			case "outhroo":
				item.type = 'publication';
				this.sessionService.setDataShare(item);
				break;
			case "twitter":
				window.open('https://twitter.com/intent/tweet?text=' + urlExtension, '_blank');
				break;
			case "whatsapp":
				window.open('https://' + (this.environment.mobile ? 'api': 'web') + '.whatsapp.com/send?text=' + urlExtension, '_blank');
				break;
			case "facebook":
				window.open('https://www.facebook.com/sharer/sharer.php?u=' + urlExtension, '_blank');
				break;
			case "email":
				window.open('mailto:?body=' + urlExtension);
				break;
			case "copyLink":
				let copyText: any = this.document.getElementById('hiddenInputForCopyLink');
				copyText.value = urlExtension;
				copyText.select();
  				this.document.execCommand("Copy");
  				this.alertService.success(this.translations.copied);
				break;
		}
	}

	// Push Google Ad
	pushAd(){
		let ad = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5692822538817681" data-ad-slot="1635841852" data-ad-format="auto"></ins>';
		let a = {
			id: null,
			contentTypeAd: true,
			content: ad
		}

		setTimeout(() => {
			let g = (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
			if (g == 1) this.hideAd = true;
		}, 100);

		return a;
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
			this.audioPlayerData.user = this.sessionData.current.id;
			this.audioPlayerData.username = this.sessionData.current.username;
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
					user: this.sessionData.current.id,
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
					user: this.sessionData.current.id,
					type: item.type,
					location: 'playlist',
					item: item.song,
					playlist: playlist.idPlaylist
				}

				this.audioDataService.addRemove(dataP)
					.subscribe(res => {
						let song = item.original_title ? (item.original_artist + ' - ' + item.original_title) : item.title;
						this.alertService.success(song + ' ' + this.translations.hasBeenAddedTo + ' ' + playlist.title);
					}, error => {
						this.alertService.success(this.translations.anErrorHasOcurred);
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
				item.type = 'audio';
				this.sessionService.setDataReport(item);
			break;
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

	// Show/hide comments box
	showComments(item){
		if (item.showCommentsBox) {
			item.showCommentsBox = false;
		} else {
			item.showCommentsBox = true;
			this.newComment('clear', null, item);

			// Load comments
			this.defaultComments('default', item);
		}
	}

	// Comments
	defaultComments(type, item) {
		if (type == 'default') {
			item.noData = false;
			item.loadMoreData = false;
			item.loadingData = true;
			item.comments.new = '';
			item.comments.list = [];
			item.rowsComments = 0;

			let data = {
				id: item.id,
				rows: item.rowsComments,
				cuantity: this.environment.cuantity
			}

			this.publicationsDataService.comments(data)
				.subscribe(res => {
					item.loadingData = false;

					if (res.length == 0) {
						item.noData = true;
					} else {
						item.noData = false;
						item.loadMoreData = (res.length < this.environment.cuantity) ? false : true;
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
						item.loadMoreData = (res.length < this.environment.cuantity) ? false : true;

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
					// console.log("key navigation up-down-left-right");
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
					receiver: item.user.id,
					comment: formatedData.content,
					comment_original: formatedData.original,
					mentions: formatedData.mentions
				}

				this.publicationsDataService.comment(dataCreate)
					.subscribe((res: any) => {
						res = res.json();
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
					user: this.sessionData.current.id,
					type: comment.type,
					id: comment.id
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

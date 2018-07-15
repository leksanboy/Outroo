import { Component, OnInit, ElementRef, ViewChild, Inject, AfterViewChecked } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipsModule } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { ChatDataService } from '../../../../app/core/services/user/chatData.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { AlertService } from '../../../../app/core/services/alert/alert.service';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

@Component({
	selector: 'app-showConversation',
	templateUrl: './showConversation.component.html',
	animations: [
		trigger(
			'showFromBottomAnimation',
			[
				transition(':enter', [
					style({transform: 'translateY(100%)', 'opacity': 0}),
					animate('200ms', style({'transform': 'translateY(0)', '-webkit-transform': 'translateY(0)', 'opacity': 1}))
				]),
				transition(':leave', [
					style({transform: 'translateY(0)', 'opacity': 1}),
					animate('200ms', style({'transform': 'translateY(100%)', '-webkit-transform': 'translateY(100%)', 'opacity': 0}))
				])
			]
		)
	],
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class ShowConversationComponent implements OnInit, AfterViewChecked {
	@ViewChild('conversationContainer') private myScrollContainer: ElementRef;
	public environment: any = environment;
	public translations: any = [];
	public sessionData: any = [];
	public actionFormSearch: FormGroup;
	public dataUsers: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataSearch: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataChats: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public showUsers: boolean;
	public saveLoading: boolean;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowConversationComponent>,
		private location: Location,
		private _fb: FormBuilder,
		private chatDataService: ChatDataService,
		private followsDataService: FollowsDataService,
		private notificationsDataService: NotificationsDataService,
		private alertService: AlertService
	) {
		this.translations = data.translations;
		this.sessionData = data.sessionData;
		this.data.current = data.item ? data.item : [];
		this.data.list = [];
		this.data.users = [];
		this.data.new = false;

		console.log("this.data", this.data);

		// New comments set
		this.newComment('clear', null, this.data.current);

		// Check if is new or conversation
		if (this.data.comeFrom == 'new'){
			this.data.active = 'default';

			// Get default following users list
			this.defaultUsers();

			// Search
			this.actionFormSearch = this._fb.group({
				caption: ['']
			});

			// Search/Reset
			this.actionFormSearch.controls["caption"].valueChanges
				.pipe(
					debounceTime(400),
					distinctUntilChanged())
				.subscribe(val => {
					(val.length > 0) ? this.search('default') : this.search('clear');
				});
		} else if (this.data.comeFrom == 'conversation'){
			this.data.list = data.item.list ? data.item.list : [];
			this.data.users = data.item.users ? data.item.users : [];
		} else if (this.data.comeFrom == 'share'){
			this.data.active = 'default';

			// Get default following users list
			this.defaultUsers();

			// Get default chats
			this.defaultChats();

			// Search
			this.actionFormSearch = this._fb.group({
				caption: ['']
			});

			// Search/Reset
			this.actionFormSearch.controls["caption"].valueChanges
				.pipe(
					debounceTime(400),
					distinctUntilChanged())
				.subscribe(val => {
					(val.length > 0) ? this.search('default') : this.search('clear');
				});
		}
	}

	ngOnInit() {
		// not in use
	}

	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	// Auto scroll to bottom
	scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch(err) { }
	}

	/////////
	// NEW //
	/////////

	// Default users
	defaultUsers(){
		this.dataUsers = {
			list: [],
			rows: 0,
			noData: false,
			loadingData: true,
			loadMoreData: false,
			loadingMoreData: false
		}

		let data = {
			user: this.sessionData.current.username,
			session: this.sessionData.current.id,
			type: 'following',
			rows: this.dataUsers.rows,
			cuantity: environment.cuantity
		}

		this.followsDataService.default(data)
			.subscribe(res => {
				this.dataUsers.loadingData = false;

				if (res.length == 0) {
					this.dataUsers.noData = true;
				} else {
					res.length < environment.cuantity ? this.dataUsers.loadMoreData = false : this.dataUsers.loadMoreData = true;
					this.dataUsers.noData = false;
					this.dataUsers.list = res;
				}
			}, error => {
				this.dataUsers.loadingData = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	// Default chats
	defaultChats(){
		this.dataUsers = {
			list: [],
			rows: 0,
			noData: false,
			loadingData: true,
			loadMoreData: false,
			loadingMoreData: false
		}

		let data = {
			user: this.sessionData.current.id,
			rows: this.dataUsers.rows,
			cuantity: environment.cuantity
		}

		this.chatDataService.default(data)
			.subscribe(res => {
				this.dataChats.loadingData = false;

				if (res.length == 0) {
					this.dataChats.noData = true;
					this.dataChats.noMore = true;
				} else {
					this.dataChats.loadMoreData = (res.length < environment.cuantity) ? false : true;
					this.dataChats.noData = false;
					this.dataChats.list = res;

					if (res.length < environment.cuantity)
						this.dataChats.noMore = true;
				}
			}, error => {
				this.dataChats.loadingData = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	// Search
	search(type){
		if (type == 'default') {
			this.data.active = 'search';
			this.dataSearch = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				session: this.sessionData.current.id,
				user: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				cuantity: environment.cuantity
			}

			this.followsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadingData = false;

						if (res.length == 0) {
							this.dataSearch.noData = true;
							this.dataSearch.noMore = true;
						} else {
							this.dataSearch.loadMoreData = (res.length < environment.cuantity) ? false : true;
							this.dataSearch.noData = false;
							
							// validate added
							for(let i in res)
								for(let u in this.data.users)
									if (res[i].id == this.data.users[u].user.id)
										res[i].added = true;

							this.dataSearch.list = res;

							if (res.length < environment.cuantity)
								this.dataSearch.noMore = true;
						}
					}, 600);
				});
		} else if (type == 'more' && !this.dataSearch.noMore) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			let data = {
				session: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: environment.cuantity
			}

			this.followsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataSearch.loadingMoreData = false;

						// Push items
						if (res.length > 0)
							for (let i in res)
								this.dataSearch.list.push(res[i]);

						if (res.length < environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				});
		} else if (type == 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}

	// Add to new chat
	addUserToNewChat(type, item){
		item.type = type;
		item.added = !item.added;

		if (!item.added) {
			// Remove from users list and chat list
			if (type == 'user') {
				for (let i in this.dataUsers.list)
					if (this.dataUsers.list[i].id == item.id)
						this.dataUsers.list[i].added = false;
			} else if (type == 'chat') {
				for (let i in this.dataChats.list)
					if (this.dataChats.list[i].id == item.id)
						this.dataChats.list[i].added = false;
			}

			// Remove from common list
			for (let i in this.data.users) {
				if (this.data.users[i].id == item.id && this.data.users[i].type == item.type){
					this.data.users.splice(i, 1);
					return false;
				}
			}
		} else {
			this.data.users.push(item);
		}
	}

	initNewChat(){
		this.saveLoading = true;
		let list = [];

		for (let i in this.data.users)
			list.push(this.data.users[i].id);

		list.push(this.sessionData.current.id);

		let data = {
			sender: this.sessionData.current.id,
			receivers: list
		}

		this.chatDataService.newChat(data)
			.subscribe((res: any) => {
				this.saveLoading = false;
				this.data.comeFrom = 'conversation';
				this.data.current.id = res;
				this.data.new = true;
			}, error => {
				this.saveLoading = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	sendShared(){
		console.log("LIST:", this.data.users);

		for (let i in this.data.users) {
			if (this.data.users[i].type == 'user') {
				let list = [];
				list.push(this.data.users[i].user.id);
				list.push(this.sessionData.current.id);

				let data = {
					sender: this.sessionData.current.id,
					receivers: list,
					publication:  this.data.item.id
				}

				// Create respective chats and insert publication
				this.chatDataService.newChat(data)
					.subscribe((res: any) => {
						this.saveLoading = false;
						this.data.comeFrom = 'conversation';
						this.data.current.id = res;
						this.data.new = true;
					}, error => {
						this.saveLoading = false;
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			} else if (this.data.users[i].type == 'chat') {
				let dataCreate = {
					type: 'create',
					chat: this.data.users[i].id,
					user: this.sessionData.current.id,
					publication: this.data.item.id,
					action: 'publication'
				}

				this.chatDataService.comment(dataCreate).subscribe();
			}
		}

		this.alertService.success(this.translations.sentSuccessfully);
		this.close();
	}

	//////////////////
	// CONVERSATION //
	//////////////////

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
					chat: item.id,
					user: this.sessionData.current.id,
					content: formatedData.content,
					content_original: formatedData.original,
					action: 'text'
				}

				this.chatDataService.comment(dataCreate)
					.subscribe((res: any) => {
						this.data.list.push(res);
						item.noData = false;

						this.newComment('clear', null, item);
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			}
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

	// Close dialog
	close(){
		this.data.close = true;
		
		// On close check if is new so then add to the list on component page
		if (this.data.list.length > 0)
			this.data.last = this.data.list[this.data.list.length-1].content;

		this.dialogRef.close(this.data);
	}

	// TODO
	// Add more person to conversaion(){ }
}

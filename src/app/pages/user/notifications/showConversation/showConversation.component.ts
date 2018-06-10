import { Component, OnInit, ElementRef, ViewChild, Inject, AfterViewChecked } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipsModule } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ChatDataService } from '../../../../../app/core/services/user/chatData';
import { NotificationsDataService } from '../../../../../app/core/services/user/notificationsData';
import { FollowsDataService } from '../../../../../app/core/services/user/followsData';
import { AlertService } from '../../../../../app/core/services/alert/alert.service';

import { TimeagoPipe } from '../../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../../app/core/pipes/safehtml.pipe';

@Component({
	selector: 'app-conversation',
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
export class NotificationsShowConversationComponent implements OnInit, AfterViewChecked {
	@ViewChild('conversationContainer') private myScrollContainer: ElementRef;
	public environment: any = environment;
	public translations: any = [];
	public sessionData: any = [];
	public chatData: any = [];
	public actionFormSearch: FormGroup;
	public dataDefault: any = {
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
	public showUsers: boolean;
	public saveLoading: boolean;
	public searchBoxMentions: boolean;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NotificationsShowConversationComponent>,
		private location: Location,
		private _fb: FormBuilder,
		private chatDataService: ChatDataService,
		private followsDataService: FollowsDataService,
		private notificationsDataService: NotificationsDataService,
		private alertService: AlertService
	) { }

	ngOnInit() {
		this.translations = this.data.translations;
		this.sessionData = this.data.sessionData;
		this.chatData = this.data.chat;

		console.log("CHAT DATA:", this.data);

		// Check if is conversation and set avatars
		if (this.data.comeFrom == 'new'){
			this.data.active = 'default';
			this.data.chatUsers = [];

			// Get default following users list
			this.default(this.data.session);
		} else if (this.data.comeFrom == 'conversation'){
			this.newComment('clear', null, this.data);
		}

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

	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	// Auto scroll to bottom
	scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch(err) { }
	}

	// Item Options
	itemOptions(type: any, item: any){
		switch (type) {
			case "remove":
				item.typeRemove = item.addRemoveSession ? "add" : "remove";

				let dataAddRemove = {
					id: item.id,
					type: item.typeRemove,
					user: this.data.session.id
				}

				this.chatDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "report":
				alert("Working on Report");
				break;
			case "close":
				this.dialogRef.close();
				break;
		}
	}

	/////////
	// NEW //
	/////////

	// Default
	default(data: any){
		this.dataDefault = {
			list: [],
			rows: 0,
			noData: false,
			loadingData: true,
			loadMoreData: false,
			loadingMoreData: false
		}

		let d = {
			user: data.username,
			session: data.id,
			type: 'following',
			rows: this.dataDefault.rows,
			cuantity: environment.cuantity
		}

		this.followsDataService.default(d)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (res.length == 0) {
						this.dataDefault.noData = true;
					} else {
						res.length < environment.cuantity ? this.dataDefault.loadMoreData = false : this.dataDefault.loadMoreData = true;
						this.dataDefault.noData = false;
						this.dataDefault.list = res;
					}
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
				session: this.data.session.id,
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
				session: this.data.session.id,
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

	// // Search
	// search(type: any){
	// 	if (type == 'default') {
	// 		this.data.active = 'search';
	// 		this.dataSearch = {
	// 			list: [],
	// 			rows: 0,
	// 			noData: false,
	// 			loadingData: true,
	// 			loadMoreData: false,
	// 			loadingMoreData: false
	// 		}
    //
	// 		let data = {
	// 			session: this.data.session.id,
	// 			caption: this.actionFormSearch.get('caption').value,
	// 			cuantity: environment.cuantity
	// 		}
    //
	// 		this.followsDataService.search(data)
	// 			.subscribe(res => {
	// 				setTimeout(() => {
	// 					this.dataSearch.loadingData = false;
    //
	// 					if (res.length == 0) {
	// 						this.dataSearch.noData = true;
	// 					} else {
	// 						res.length < environment.cuantity ? this.dataSearch.loadMoreData = false : this.dataSearch.loadMoreData = true;
	// 						for (let c in this.data.chatUsers)
	// 							if (this.data.chatUsers[c].id == res[i].id)
	// 								res[i].added = true;
	// 					}
    //
	// 						this.dataSearch.noData = false;
	// 						this.dataSearch.list = res;
	// 					}
	// 				}, 600);
	// 			});
	// 	} else if (type == 'more') {
	// 		this.dataSearch.loadingMoreData = true;
	// 		this.dataSearch.rows++;
    //
	// 		let data = {
	// 			caption: this.actionFormSearch.get('caption').value,
	// 			rows: this.dataSearch.rows,
	// 			cuantity: environment.cuantity
	// 		}
    //
	// 		this.followsDataService.search(data)
	// 			.subscribe(res => {
	// 				setTimeout(() => {
	// 					this.dataSearch.loadingMoreData = false;
    //
	// 					// Push items
	// 					if (res.length > 0)
	// 						for (let i in res) {
	// 							for (let c in this.data.chatUsers)
	// 								if (this.data.chatUsers[c].id == res[i].id)
	// 									res[i].added = true;
    //
	// 							this.dataSearch.list.push(res[i]);
	// 						}
    //
	// 					res.length < environment.cuantity ? this.dataSearch.loadMoreData = false : this.dataSearch.loadMoreData = true;
	// 				}, 600);
	// 			});
	// 	} else if (type == 'clear') {
	// 		this.data.active = 'default';
	// 		this.actionFormSearch.get('caption').setValue('');
    //
	// 		for (let i in this.dataDefault.list)
	// 			this.dataDefault.list[i].added = false;
    //
	// 		for (let i in this.dataDefault.list)
	// 			for (let c in this.data.chatUsers)
	// 				if (this.data.chatUsers[c].id == this.dataDefault.list[i].id)
	// 					this.dataDefault.list[i].added = true;
	// 	}
	// }

	// Add to new chat
	addUserToNewChat(item){
		item.added = !item.added;

		if (this.data.chatUsers.length > 0) {
			for (let i in this.data.chatUsers) {
				if (this.data.chatUsers[i].id == item.id){
					this.data.chatUsers.splice(i, 1);
					return false;
				}
			}

			this.data.chatUsers.push(item);
		} else {
			this.data.chatUsers.push(item);
		}
	}

	initNewChat(){
		this.saveLoading = true;
		let list = [];

		for (let i in this.data.chatUsers)
			list.push(this.data.chatUsers[i].id);

		list.push(this.data.session.id);

		let data = {
			sender: this.data.session.id,
			receivers: list
		}

		this.chatDataService.newChat(data)
			.subscribe((res: any) => {
				this.saveLoading = false;
				this.data.comeFrom = 'conversation';
				this.chatData = [];
				this.chatData.id = res;
				this.chatData.users = this.data.chatUsers;
				this.chatData.conversation = [];
				this.data.newComment = '';
			}, error => {
				this.saveLoading = false;
				this.alertService.error('An error has ocurred');
			});
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
					chat: this.chatData.id,
					user: this.sessionData.current.id,
					content: formatedData.content,
					content_original: formatedData.original
				}

				this.chatDataService.comment(dataCreate)
					.subscribe((res: any) => {
						this.chatData.conversation.push(res);
						this.newComment('clear', null, item);
					});
			}
		}
	}
}

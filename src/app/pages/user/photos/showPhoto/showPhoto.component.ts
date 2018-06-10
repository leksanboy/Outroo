import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';

import { PhotoDataService } from '../../../../../app/core/services/user/photoData';
import { SessionService } from '../../../../../app/core/services/session/session.service';
import { NotificationsDataService } from '../../../../../app/core/services/user/notificationsData';

import { TimeagoPipe } from '../../../../../app/core/pipes/timeago.pipe';

@Component({
	selector: 'app-showPhoto',
	templateUrl: './showPhoto.component.html',
	providers: [ TimeagoPipe ]
})
export class PhotosShowPhotoComponent implements OnInit {
	@ViewChild('videoPlayer') videoPlayer: any;

	public environment: any = environment;
	public sessionData: any = [];
	public userData: any = [];
	public translations: any = [];
	public noData: boolean;
	public loadingData: boolean;
	public loadMoreData: boolean;
	public loadingMoreData: boolean;
	public actionFormNewComment: FormGroup;
	public rowsComments: number;
	public notExist: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<PhotosShowPhotoComponent>,
		private location: Location,
    	private _fb: FormBuilder,
		private sessionService: SessionService,
		private photoDataService: PhotoDataService,
		private notificationsDataService: NotificationsDataService
	) {
		this.translations = this.data.translations;
		this.sessionData = this.data.sessionData;
		this.userData = this.data.userData;

		this.data.current = this.data.item ? this.data.item : [];
		this.data.list = this.data.list ? this.data.list : [];
		this.data.comments = {
			new: '',
			list: []
		};

		if (this.data.item) {
			// Check if exists
    		this.notExist = false;

		    // Set url
	    	if (this.data.comeFrom == 'photos')
		    	this.location.go('/' + this.userData.username + '/photos/' + this.data.current.name.split('.')[0]);

	    	// Set comment clear
	    	this.newComment('clear');

	    	// Check if photo is liked
	    	this.checkLike();

	    	// Load comments
	    	this.defaultComments('default', this.data.current.id);

	    	// Update replays
	    	this.updateReplays(this.data.current.id, this.sessionData.current.id);
    	} else {
    		// Check if exists
    		this.notExist = true;
    	}
	}

	ngOnInit() {
		// No init
	}

    // Prev/Next
    prevNext(type) {
    	// Prev / Next
    	if (type == 'prev')
    		this.data.index == 0 ? this.data.index = this.data.list.length - 1 : this.data.index = this.data.index - 1;
    	else if (type == 'next')
    		this.data.index == this.data.list.length - 1 ? this.data.index = 0 : this.data.index = this.data.index + 1;

    	// Set new photo from list
    	this.data.current = this.data.list[this.data.index];
    	this.data.current.playButton = false;

    	// Change url whitout reloading
		this.location.go('/' + this.userData.username + '/photos/' + this.data.current.name.split('.')[0]);

    	// Check if photo is liked
    	this.checkLike();

    	// Set comment clear
    	this.newComment('clear');

    	// Set comments
    	this.defaultComments('default', this.data.current.id);

    	// Update replays
    	this.updateReplays(this.data.current.id, this.sessionData.current.id);
    }

    playVideo(type){
    	this.videoPlayer.nativeElement.removeAttribute("controls");
    	this.videoPlayer.nativeElement.play();
    	this.data.current.playButton = true;
    }

    // Replays +1
	updateReplays(id, user) {
		let data = {
			id: id,
			user: user
		}

		this.photoDataService.updateReplays(data).subscribe();
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

			this.photoDataService.comments(data)
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

			this.photoDataService.comments(data)
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
		if(this.data.current.id){
			if (item.liked) {
				item.liked = false;
				item.countLikes--;

				for (let i in item.likers) {
					if (item.likers[i].id == this.sessionData.current.id)
						item.likers.splice(i, 1);
				}
			} else {
				item.liked = true;
				item.countLikes++;

				item.likers.unshift(this.userData.current);
			}

			// Send request
			let data = {
				photo: item.id,
				user: this.sessionData.current.id,
				type: item.liked ? 'like' : 'unlike'
			}

			this.photoDataService.likeUnlike(data).subscribe();

			// // Send notification
			// if (item.liked == true) {
			// 	let n = {
			// 		sender: this.sessionData.current.id,
			// 		receiver: this.userData.id,
			// 		page: this.data.current.id,
			// 		url: 'photos',
			// 		type: 'like',
			// 		name: this.data.current.name.split('.')[0],
			// 		contentMedia: this.data.current.name,
			// 		contentMediaType: this.data.current.mimetype,
			// 		delete: false
			// 	};

			// 	this.notificationsDataService.generateNotification(n).subscribe();
			// } else {
			// 	let n = {
			// 		sender: this.sessionData.current.id,
			// 		receiver: this.userData.id,
			// 		page: this.data.current.id,
			// 		type: 'like',
			// 		delete: true
			// 	};

			// 	this.notificationsDataService.generateNotification(n).subscribe();
			// }
		}
	}

	// Check like
	checkLike(){
		let data = {
			id: this.data.current.id,
			user: this.sessionData.current.id
		}

		this.photoDataService.checkLike(data)
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
					user: this.sessionData.current.id,
					photo: this.data.current.id,
					comment: this.data.current.newComment
				}

				this.photoDataService.comment(dataCreate)
					.subscribe((res: any) => {
						res = res.json();
						this.data.comments.list.unshift(res);
						this.data.current.countComments++;
						this.newComment('clear');
						this.noData = false;

						// // Send notification
						// let n = {
						// 	sender: this.sessionData.current.id,
						// 	receiver: this.userData.id,
						// 	page: this.data.current.id,
						// 	url: 'photos',
						// 	type: 'comment',
						// 	name: this.data.current.name.split('.')[0],
						// 	contentMedia: this.data.current.name,
						// 	contentComment: res.comment,
						// 	contentMediaType: this.data.current.mimetype
						// };

						// this.notificationsDataService.generateNotification(n).subscribe();
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
					user: this.sessionData.current.id
				}

				this.photoDataService.addRemove(dataAddRemove).subscribe();
				break;
			case "disableComments":
				item.disabledComments = !item.disabledComments;

				let dataDisableComments = {
					id: item.id,
					type: item.disabledComments,
					user: this.sessionData.current.id
				}

				this.photoDataService.enableDisableComments(dataDisableComments).subscribe();
				break;
			case "share":
				alert("Working on Share");
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

				this.photoDataService.comment(data)
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
}

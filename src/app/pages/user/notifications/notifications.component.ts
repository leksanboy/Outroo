import { DOCUMENT, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { NotificationsDataService } from '../../../../app/core/services/user/notificationsData.service';
import { FollowsDataService } from '../../../../app/core/services/user/followsData.service';
import { ChatDataService } from '../../../../app/core/services/user/chatData.service';
import { PhotoDataService } from '../../../../app/core/services/user/photoData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';

import { PhotosShowPhotoComponent } from '../photos/showPhoto/showPhoto.component';
import { MainShowPublicationComponent } from '../main/showPublication/showPublication.component';
import { NotificationsShowConversationComponent } from './showConversation/showConversation.component';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;

// [OK] TODO: Ver las notificaciones de las publicaciones en modalDialog (showPublication);
// [OK] TODO: Revisar la pagina de fotos cuando es una foto (recargar la pagina con una foto abierta).
// [OK] TODO: Mirar lo de Private account aceptar la petición en (notifications, user).
// [OK] TODO: Link a href en photos; mirar como esta en VK.
// [OK] TODO: En user.component poner el detect de url para setting/pending/home/news para hacer redirect a index.
// [-] TODO: Capar el boton de likes y parecidos a 5-6 click despues deshabilitar el boton para siempre.
// [-] TODO: Ver la pagina de user sin tener sesion.
// [-] TODO: Compartir en twitter.

// [·] TODO: Terminar el chat sin websocket.
// [·] TODO: Mirar lo del websocket.
// [·] TODO: Al borrar un comentario quitar tambien la notificacion.

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public activeRouter: any;
	public data: any = {
		selectedIndex: 0
	};
	public dataNotifications: any = {
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

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private chatDataService: ChatDataService,
		private photoDataService: PhotoDataService,
		private followsDataService: FollowsDataService,
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
					// Go top of page on change user
					window.scrollTo(0, 0);

					// Set Google analytics
					let urlGa =  '[' + this.sessionData.current.id + ']/notifications';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Set Document title
					this.titleService.setTitle('Notifications');

					// Load defaultNotifications
					this.defaultNotifications('default', this.sessionData.current.id);

					// Load defaultChats
					this.defaultChats('default', this.sessionData.current.id);
				}
			});

		// Load more on scroll on bottom
		window.onscroll = (event) => {
			let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			let body = document.body, html = document.documentElement;
			let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			let windowBottom = windowHeight + window.pageYOffset;

			if (windowBottom >= docHeight) {
				switch (this.data.selectedIndex) {
					case 0:
						if (this.dataNotifications.list.length > 0)
							this.defaultNotifications('more', null);
						break;
					case 1:
						if (this.dataChats.list.length > 0)
							this.defaultChats('more', null);
						break;
				}
			}
		}
	}

	ngOnInit() {
		// not in use
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		// this.activeSession.unsubscribe();
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Default
	defaultNotifications(type, user) {
		if (type == 'default') {
			this.dataNotifications = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				user: user,
				rows: this.dataNotifications.rows,
				cuantity: environment.cuantity
			}

			this.notificationsDataService.default(data)
				.subscribe(res => {
					this.dataNotifications.loadingData = false;

					if (res.length == 0) {
						this.dataNotifications.noData = true;
						this.dataNotifications.noMore = true;
					} else {
						this.dataNotifications.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataNotifications.noData = false;

						for (let i in res)
							setTimeout(() => {
								res[i].status = 1;
							}, 1800);

						this.dataNotifications.list = res;
						this.sessionService.setPendingNotifications('refresh');

						if (res.length < environment.cuantity)
							this.dataNotifications.noMore = true;
					}
				}, error => {
					this.dataNotifications.loadingData = false;
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataNotifications.noMore) {
			this.dataNotifications.loadingMoreData = true;
			this.dataNotifications.rows++;

			let data = {
				user: this.sessionData.current.id,
				rows: this.dataNotifications.rows,
				cuantity: environment.cuantity
			}

			this.notificationsDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataNotifications.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataNotifications.loadingMoreData = false;

						// Push items
						if (res.length > 0)
							for (let i in res) {
								setTimeout(() => {
									res[i].status = 1;
								}, 1800);

								this.dataNotifications.list.push(res[i]);
							}

						this.sessionService.setPendingNotifications('refresh');

						if (res.length < environment.cuantity)
							this.dataNotifications.noMore = true;
					}, 600);
				}, error => {
					this.dataNotifications.loadingData = false;
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Follow / Unfollow
	followUnfollow(type, item){
		if (type == 'accept') {
			// When other send you a request
			item.type = 'startFollowing';
			item.statusF = 'accept';

			let data = {
				type: item.statusF,
				private: item.private,
				receiver: this.sessionData.current.id,
				sender: item.user.id
			}

			// Check following status
			this.followsDataService.followUnfollow(data)
				.subscribe((res: any) => {
					item.statusFollowing = res;
				});
		} else if (type == 'decline') {
			// When other send you a request
			item.type = 'startFollowing';
			item.statusFollowing = 'declined';
			item.statusF = 'decline';

			let data = {
				type: item.statusF,
				private: item.private,
				receiver: this.sessionData.current.id,
				sender: item.user.id
			}

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type == 'follow') { 
			// When you start following someone who follow you
			item.statusFollowing = item.private ? 'pending' : 'following';

			let data = {
				type: item.statusFollowing,
				private: item.private,
				receiver: item.user.id,
				sender: this.sessionData.current.id
			}

			this.followsDataService.followUnfollow(data).subscribe();
		} else if (type == 'unfollow') { 
			// Stop following
			item.statusFollowing = 'unfollow';

			let data = {
				type: item.statusFollowing,
				private: item.private,
				receiver: item.user.id,
				sender: this.sessionData.current.id
			}

			this.followsDataService.followUnfollow(data).subscribe();
		}
	}

	// Show photo from url if is one
	showNotification(item) {
		if (item.url == 'photos') {
			let data = item.contentData.name;

			this.photoDataService.getDataByName(data)
				.subscribe((res: any) => {
					this.location.go(this.router.url + '#photo');

					let config = {
						disableClose: false,
						data: {
							comeFrom: 'notifications',
							translations: this.translations,
							sessionData: this.sessionData,
							userData: (res ? res.user : null),
							item: (res ? res.data : null),
							index: null,
							list: []
						}
					};

					// Open dialog
					let dialogRef = this.dialog.open( PhotosShowPhotoComponent, config);
					dialogRef.afterClosed().subscribe((result: any) => {
						this.location.go(this.router.url);
					});
				});
		} else if (item.url == 'publications') {
			let data = {
				name: item.name
			}

			this.publicationsDataService.getDataByName(data)
				.subscribe((res: any) => {
					this.location.go(this.router.url + '#publication');

					let config = {
						disableClose: false,
						data: {
							comeFrom: 'notifications',
							translations: this.translations,
							sessionData: this.sessionData,
							userData: (res ? res.user : null),
							item: (res ? res.data : null)
						}
					};

					// Open dialog
					let dialogRef = this.dialog.open( MainShowPublicationComponent, config);
					dialogRef.afterClosed().subscribe((result: any) => {
						this.location.go(this.router.url);
					});
				});
		}
	}

	// // Item options: add/remove, share, search, report
	// itemOptionsNotifications(type, item){
	// 	switch(type){
	// 		case("addRemoveSession"):
	// 			// item.type = item.addRemoveSession ? "add" : "remove";

	// 			// let dataSession = {
	// 			// 	id: item.id,
	// 			// 	type: item.type,
	// 			// 	user: this.sessionData.current.id
	// 			// }

	// 			// this.chatDataService.addRemove(dataSession).subscribe();
	// 		break;
	// 		case("report"):
	// 			alert("Working on report");
	// 			// item.type = 'notification';
	// 			// this.sessionService.setDataReport(item);
	// 		break;
	// 	}
	// }

	// Default
	defaultChats(type, user) {
		if (type == 'default') {
			this.dataChats = {
				list: [],
				rows: 0,
				noData: false,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				user: user,
				rows: this.dataChats.rows,
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
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataChats.noMore) {
			this.dataChats.loadingMoreData = true;
			this.dataChats.rows++;

			let data = {
				user: this.sessionData.current.id,
				rows: this.dataChats.rows,
				cuantity: environment.cuantity
			}

			this.chatDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataChats.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataChats.loadingMoreData = false;

						if (res.length > 0)
							for (let i in res) {
								if (res[i].conversation)
									res[i].last = res[i].conversation[res[i].conversation.length-1];

								this.dataChats.list.push(res[i]);
							}

						if (res.length < environment.cuantity)
							this.dataChats.noMore = true;
					}, 600);
				}, error => {
					this.dataChats.loadingData = false;
					this.alertService.success(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Item options: add/remove, share, search, report
	itemOptionsChat(type, item){
		switch(type){
			case("addRemoveSession"):
				item.type = item.addRemoveSession ? "add" : "remove";

				let dataSession = {
					id: item.id,
					type: item.type,
					user: this.sessionData.current.id
				}

				this.chatDataService.addRemove(dataSession).subscribe();
			break;
			case("report"):
				item.type = 'chat';
				this.sessionService.setDataReport(item);
			break;
		}
	}

	// Open conversation
	showConversation(type, data) {
		this.location.go('/notifications#' + type);

		let config = {
			disableClose: false,
			data: {
				chat: data,
				sessionData: this.sessionData,
				translations: this.translations,
				comeFrom: type
			}
		};

		// Open dialog
		let dialogRef = this.dialog.open( NotificationsShowConversationComponent, config);
		dialogRef.afterClosed().subscribe((result: any) => {
			this.location.go('/notifications');
		});
	}
}

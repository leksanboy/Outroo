import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';
import { PublicationsDataService } from '../../../../app/core/services/user/publicationsData.service';

import { ShowPublicationComponent } from '../../../../app/pages/common/showPublication/showPublication.component';

import { TimeagoPipe } from '../../../../app/core/pipes/timeago.pipe';
import { SafeHtmlPipe } from '../../../../app/core/pipes/safehtml.pipe';

declare var ga: Function;

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	providers: [ TimeagoPipe, SafeHtmlPipe ]
})
export class NewsComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public activeRouter: any;
	public activeSessionPlaylists: any;
	public hideAd: boolean;
	public actionFormSearch: FormGroup;
	public data: any;
	public dataDefault: any = {
		list: [],
		rows: 0,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataSearch: any = {
		list: [],
		rows: 0,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		private _fb: FormBuilder,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private publicationsDataService: PublicationsDataService
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
					let urlGa =  '[' + this.sessionData.current.id + ']/news';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Set Document title
					this.titleService.setTitle('News');

					// Load default
					this.default('default', this.sessionData.current.id, this.sessionData.current.id);
				}
			});

		// Session playlists
		this.activeSessionPlaylists = this.sessionService.getDataPlaylists()
			.subscribe(data => {
				this.sessionData = data;
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

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		this.activeSessionPlaylists.unsubscribe();
	}

	// Push Google Ad
	pushAd(){
		let ad = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5692822538817681" data-ad-slot="1635841852" data-ad-format="auto"></ins>';
		let a = {
			contentTypeAd: true,
			content: ad
		}

		setTimeout(() => {
			let g = (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
			if (g == 1) this.hideAd = true;
		}, 100);

		return a;
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
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				type: 'news',
				user: user,
				session: session,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity*6
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					this.dataDefault.loadingData = false;

					if (!res || res.length == 0) {
						this.dataDefault.noMore = true;
					} else {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						// this.dataDefault.list = res;

						for (let i in res) {
							// Push items
							this.dataDefault.list.push(res[i]);

							// Push add
							if (i == '30' || i == '60')
								this.dataDefault.list.push(this.pushAd());
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataDefault.noMore = true;
					}
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataDefault.noMore && !this.dataDefault.loadingMoreData) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				type: 'news',
				user: this.sessionData.current.id,
				session: this.sessionData.current.id,
				rows: this.dataDefault.rows,
				cuantity: this.environment.cuantity*6
			}

			this.publicationsDataService.default(data)
				.subscribe(res => {
					console.log("RES:", res);

					setTimeout(() => {
						this.dataDefault.loadMoreData = (!res || res.length < this.environment.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						if (!res || res.length > 0) {
							for (let i in res){
								// Push items
								this.dataDefault.list.push(res[i]);

								// Push add
								if (i == '30' || i == '60')
									this.dataDefault.list.push(this.pushAd());
							}
						}

						if (!res || res.length < this.environment.cuantity)
							this.dataDefault.noMore = true;
					}, 600);
				}, error => {
					this.dataDefault.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		}
	}

	// Show publication
	show(item) {
		let data = item.name;

		this.publicationsDataService.getDataByName(data)
			.subscribe((res: any) => {
				this.location.go(this.router.url + '#publication');

				let config = {
					disableClose: false,
					data: {
						comeFrom: 'publications',
						translations: this.translations,
						sessionData: this.sessionData,
						userData: (res ? res.user : null),
						item: (res ? res : null)
					}
				};

				// Open dialog
				let dialogRef = this.dialog.open(ShowPublicationComponent, config);
				dialogRef.afterClosed().subscribe((result: any) => {
					this.location.go(this.router.url);
				});
			});
	}

	// Search
	search(type){
		if (type == 'default') {
			this.data.active = 'search';
			this.dataSearch = {
				list: [],
				rows: 0,
				loadingData: true,
				loadMoreData: false,
				loadingMoreData: false,
				noMore: false
			}

			let data = {
				session: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: environment.cuantity
			}

			this.publicationsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadingData = false;

						if (res.length == 0) {
							this.dataSearch.noMore = true;
						} else {
							this.dataSearch.loadMoreData = (!res || res.length < environment.cuantity) ? false : true;
							this.dataSearch.list = res;

							if (!res || res.length < environment.cuantity)
								this.dataSearch.noMore = true;
						}
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'more' && !this.dataSearch.noMore && !this.dataSearch.loadingMoreData) {
			this.dataSearch.loadingMoreData = true;
			this.dataSearch.rows++;

			let data = {
				session: this.sessionData.current.id,
				caption: this.actionFormSearch.get('caption').value,
				rows: this.dataSearch.rows,
				cuantity: environment.cuantity
			}

			this.publicationsDataService.search(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataSearch.loadMoreData = (!res || res.length < environment.cuantity) ? false : true;
						this.dataSearch.loadingMoreData = false;

						// Push items
						if (res.length > 0)
							for (let i in res)
								this.dataSearch.list.push(res[i]);

						if (!res || res.length < environment.cuantity)
							this.dataSearch.noMore = true;
					}, 600);
				}, error => {
					this.dataSearch.loadingData = false;
					this.alertService.error(this.translations.anErrorHasOcurred);
				});
		} else if (type == 'clear') {
			this.data.active = 'default';
			this.actionFormSearch.get('caption').setValue('');
		}
	}
}

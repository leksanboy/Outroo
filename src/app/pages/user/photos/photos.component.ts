import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { PhotoDataService } from '../../../../app/core/services/user/photoData';

import { PhotosShowPhotoComponent } from './showPhoto/showPhoto.component';

declare var ga: Function;

@Component({
	selector: 'app-photos',
	templateUrl: './photos.component.html'
})
export class PhotosComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public activeRouter: any;
	public activeRouterExists: any;
	// public activeSession: any;
	public userData: any = [];
	public dataDefault: any = {
		list: [],
		rows: 0,
		noData: false,
		loadingData: true,
		loadMoreData: false,
		loadingMoreData: false
	};
	public dataFiles: any = {
		list: [],
		reload: false,
		actions: true,
		saveDisabled: false,
		counter: 0
	};

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService,
		private photoDataService: PhotoDataService
	) {
		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// Get translations
		this.getTranslations(this.sessionData ? this.sessionData.current.language : this.environment.language);

		// Check session exists
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
			    	let urlData: any = this.activatedRoute.snapshot;

					// Get user data
					this.siteUserData(urlData.params.id);

					// Load default
					this.default('default', urlData.params.id);
			  	}
			});

		// Load more on scroll on bottom
		window.onscroll = (event) => {
			let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			let body = document.body, html = document.documentElement;
			let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			let windowBottom = windowHeight + window.pageYOffset;

			if (windowBottom >= docHeight)
				if (this.dataDefault.list.length > 0)
					this.default('more', null);
		}
	}

	ngOnInit() {
		// Run page on reload page
		if (!this.activeRouterExists) {
			// Get url data
	    	let urlData: any = this.activatedRoute.snapshot;

	    	// Open one photo on open photo and reloaded page
	    	if (urlData.params.name)
				this.showOne(urlData.params.name);

			// Get user data
			this.siteUserData(urlData.params.id);

			// Load default
			this.default('default', urlData.params.id);
		}
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
		// this.activeSession.unsubscribe();
	}

	// Go back
	goBack(){
		this.location.back();
	}

	// User Data of the Page
	siteUserData(id){
		this.userDataService.getUserData(id)
			.subscribe(res => {
				this.userData = res;

				// Set document title
				this.titleService.setTitle(res.name + ' - Photos');

				// Set Google analytics
				let urlGa =  '[' + res.id + ']/' + id + '/photos';
		    	ga('set', 'page', urlGa);
		    	ga('send', 'pageview');
			});
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;
			});
	}

	// Default
	default(type, user) {
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
				user: user,
				rows: this.dataDefault.rows,
				cuantity: environment.cuantity
			}

			this.photoDataService.default(data)
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
				});
		} else if (type == 'more' && !this.dataDefault.noMore) {
			this.dataDefault.loadingMoreData = true;
			this.dataDefault.rows++;

			let data = {
				user: this.userData.id,
				rows: this.dataDefault.rows,
				cuantity: environment.cuantity
			}

			this.photoDataService.default(data)
				.subscribe(res => {
					setTimeout(() => {
						this.dataDefault.loadMoreData = (res.length < environment.cuantity) ? false : true;
						this.dataDefault.loadingMoreData = false;

						if (res.length > 0)
							for (let i in res)
								this.dataDefault.list.push(res[i]);

						if (res.length < environment.cuantity)
							this.dataDefault.noMore = true;
					}, 600);
				});
		}
	}

	// Show photo
	show(item, i) {
		let config = {
			disableClose: false,
			data: {
				comeFrom: 'photos',
				sessionData: this.sessionData,
				userData: this.userData,
				translations: this.translations,
				item: item,
				index: i,
				list: this.dataDefault.list
			}
		};

		// Open dialog
		let dialogRef = this.dialog.open( PhotosShowPhotoComponent, config);
		dialogRef.afterClosed().subscribe((result: any) => {
			// this.location.go('/' + this.userData.username + '/photos');
		});
	}

	// Show photo from url if is one
	showOne(item) {
		let data = {
			name: item
		}

		this.photoDataService.getDataByName(data)
			.subscribe((res: any) => {
				let config = {
					disableClose: false,
					data: {
						comeFrom: 'photos',
						session: this.sessionData.current,
						user: (res ? res.user : null),
						item: (res ? res.data : null),
						index: null,
						list: []
					}
				};

				// Open dialog
				let dialogRef = this.dialog.open( PhotosShowPhotoComponent, config);
				dialogRef.afterClosed().subscribe((result: any) => {
					// this.location.go('/' + this.userData.username + '/photos');
				});
			});
	}

	// Upload files
	uploadFiles(type, event){
		let convertToMb = function(bytes) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
				return '-';

			let units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));

			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) +  ' ' + units[number];
		}

		if (type == 1) { // Add files
			this.dataFiles.saveDisabled = false;

			for (let i = 0; i < event.currentTarget.files.length; i++) {
				let file = event.currentTarget.files[i];
				file.status = 'clear';
				file.user = this.sessionData.current.id;

				if (file.size >= 20000000) {
					file.sizeBig = convertToMb(file.size);
					this.dataFiles.saveDisabled = true;
				}

				if (/^image\/\w+$/.test(file.type)) {
					file.category = 'image';
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.addEventListener("load", function(e) {
						file.thumbnail = e.target;
						file.thumbnail = file.thumbnail.result;
					});
				} else if (/^video\/\w+$/.test(file.type)) {
					file.category = 'video';
					file.thumbnail = URL.createObjectURL(file);
					file.thumbnail = this.sanitizer.bypassSecurityTrustUrl(file.thumbnail);
				} else {
					file.category = 'unknown';
					this.dataFiles.saveDisabled = true;
				}

				this.dataFiles.list.push(file);
			}
		} else if (type == 2) { // Ccancel
			this.dataFiles.list = [];
		} else if (type == 3) { // Remove 1 by 1
			this.dataFiles.list.splice(event, 1);

			for (let i in this.dataFiles.list) {
				if (this.dataFiles.list[i].category == 'unknown' || this.dataFiles.list[i].sizeBig) {
					this.dataFiles.saveDisabled = true;
					return true;
				} else {
					this.dataFiles.saveDisabled = false;
				}
			}
		} else if (type == 4) { // Save & Upload
			this.dataFiles.actions = false;
			let self = this;

			const ajaxCall = function(file, formdata, ajax){
				formdata.append("fileUpload", file);
				formdata.append("user", file.user);
				formdata.append("category", file.category);

				ajax.upload.addEventListener("progress", function(ev){
					progressHandler(ev, file);
				}, false);

				ajax.addEventListener("load", function(ev){
					completeHandler(ev, file);
				}, false);

				ajax.addEventListener("error", function(ev){
					errorHandler(ev, file);
				}, false);

				ajax.addEventListener("abort", function(ev){
					abortHandler(ev, file);
				}, false);

				ajax.open("POST", "./assets/api/photos/uploadFiles.php");
				ajax.send(formdata);
			}

			const progressHandler = function(event, file) {
				file.status = 'progress';
				let percent = Math.round((event.loaded / event.total) * 100);
				file.progress = Math.max(0, Math.min(100, percent));
			}

			const completeHandler = function(event, file) {
				file.status = 'completed';
				counterHandler();
			}

			const errorHandler = function(event, file) {
				file.status = 'error';
				counterHandler();
			}

			const abortHandler = function(event, file) {
				file.status = 'error';
				counterHandler();
			}

			const counterHandler = function(){
				self.dataFiles.counter = self.dataFiles.counter+1;
				self.dataFiles.reload = (self.dataFiles.list.length == self.dataFiles.counter) ? true : false;
			}

			for (let i in this.dataFiles.list) {
				let file = this.dataFiles.list[i],
					formdata = new FormData(),
					ajax = new XMLHttpRequest();

				ajaxCall(file, formdata, ajax);
			}
		} else if (type == 5) { // Reload
			this.default('default', this.sessionData.current.username);

			this.dataFiles = {
				list: [],
				reload: false,
				actions: true,
				saveDisabled: false,
				counter: 0
			}
		}
	}
}

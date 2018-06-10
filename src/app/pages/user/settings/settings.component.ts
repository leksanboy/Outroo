import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { SessionService } from '../../../../app/core/services/session/session.service';
import { UserDataService } from '../../../../app/core/services/user/userData';

import { SettingsAvatarComponent } from './avatar/avatar.component';
import { SettingsBackgroundComponent } from './background/background.component';
import { SettingsSessionComponent } from './session/session.component';

declare var ga: Function;

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public activeRouter: any;
	public activeRouterExists: any;
	public actionFormPersonalData: any;
	public actionFormPasswordData: any;
	public savePersonalDataLoading: boolean;
	public savePasswordDataLoading: boolean;
	public validatorUsername: string;
	public validatorOldPassword: string;
	public validatorNewPassword: string;
	public urlRegex: any = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		// private _fb: FormBuilder,
		public dialog: MatDialog,
		private location: Location,
		private titleService: Title,
		private sanitizer: DomSanitizer,
		private alertService: AlertService,
		private activatedRoute: ActivatedRoute,
		private sessionService: SessionService,
		private userDataService: UserDataService
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
					let urlGa =  '[' + this.sessionData.current.id + ']/settings';
					ga('set', 'page', urlGa);
					ga('send', 'pageview');

					// Set Document title
					this.titleService.setTitle('Settings');

					// Set froms
					this.setForms(this.sessionData.current);
				}
			});
	}

	ngOnInit() {
		// Run page on reload page
		if (!this.activeRouterExists) {
			this.location.go('/settings');

			// Set froms
			this.setForms(this.sessionData.current);
		}
	}

	ngOnDestroy() {
		this.activeRouter.unsubscribe();
	}

	// Get translations
	getTranslations(lang){
		this.userDataService.getTranslations(lang)
			.subscribe(data => {
				this.translations = data;

				// Data personal about
				this.aboutEdit('writingChanges', this.sessionData.current.aboutOriginal);
			});
	}

	// Set forms
	setForms(data){
		this.validatorUsername = null;
		this.validatorNewPassword = null;
		this.validatorOldPassword = null;

		// Personal data form
		this.actionFormPersonalData = new FormGroup({
			theme: new FormControl(data.theme),
			private: new FormControl(data.private),
			username: new FormControl(data.username, [Validators.required]),
			name: new FormControl(data.name, [Validators.required]),
			language: new FormControl(data.language, [Validators.required])
		});

		// Dark theme
		this.actionFormPersonalData.get('theme').valueChanges
			.subscribe(val => {
				if (val)
					this.document.body.classList.add('darkTheme');
				else
					this.document.body.classList.remove('darkTheme');

				let data = {
					id: this.sessionData.current.id,
					theme: this.actionFormPersonalData.get('theme').value
				}

				this.userDataService.updateTheme(data)
					.subscribe(res => {
						setTimeout(() => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setDataTheme(this.sessionData);

							if (val)
								this.alertService.success(this.translations.darkThemeEnabled);
							else
								this.alertService.success(this.translations.darkThemeDisabled);
						}, 1000);
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			});

		// Private account
		this.actionFormPersonalData.get('private').valueChanges
			.subscribe(val => {
				let data = {
					id: this.sessionData.current.id,
					private: this.actionFormPersonalData.get('private').value
				}

				this.userDataService.updatePrivate(data)
					.subscribe(res => {
						setTimeout(() => {
							this.sessionData = this.userDataService.getSessionData();
							this.sessionService.setData(this.sessionData);

							if (val)
								this.alertService.success(this.translations.privateAccountEnabled);
							else
								this.alertService.success(this.translations.privateAccountDisabled);
						}, 1000);
					}, error => {
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
			});

		// Validate username
		this.actionFormPersonalData.get('username').valueChanges
			.subscribe(val => {
				this.actionFormPersonalData.controls['username'].setErrors({ validate: false });
			});
		this.actionFormPersonalData.get('username').valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged())
			.subscribe(val => {
				this.validatorUsername = 'load';
				let regex = /^[a-zA-Z0-9._-]+$/;

				if (val != '' && regex.test(val)) {
					this.userDataService.checkUsername(val).subscribe(
						res => {
							setTimeout(() => {
								if (res) {
									if (val == data.username) {
										this.actionFormPersonalData.controls['username'].setErrors(null);
										this.validatorUsername = 'done';
									} else {
										this.actionFormPersonalData.controls['username'].setErrors({ validate: false });
										this.validatorUsername = 'bad';
									}
								} else {
									this.actionFormPersonalData.controls['username'].setErrors(null);
									this.validatorUsername = 'done';
								}
							}, 600);
						}
					);
				} else {
					this.actionFormPersonalData.controls['username'].setErrors({ validate: false });
					this.validatorUsername = 'bad';
				}
			});

		// Password data form
		this.actionFormPasswordData = new FormGroup({
			oldPassword: new FormControl('', [Validators.required]),
			newPassword: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('', [Validators.required])
		});

		// New password
		this.actionFormPasswordData.get('newPassword').valueChanges
			.subscribe(val => {
				this.actionFormPasswordData.controls['newPassword'].setErrors({ validate: false });
				this.validatorNewPassword = 'load';

				if (val.trim() != '') {
					setTimeout(() => {
						if(val == this.actionFormPasswordData.get('confirmPassword').value){
							this.actionFormPasswordData.controls['confirmPassword'].setErrors(null);
							this.actionFormPasswordData.controls['newPassword'].setErrors(null);
							this.validatorNewPassword = 'done';
						} else {
							this.actionFormPasswordData.controls['newPassword'].setErrors({ validate: false });
							this.validatorNewPassword = 'bad';
						}
					}, 1000);
				} else {
					this.actionFormPasswordData.controls['newPassword'].setErrors({ validate: false });
					this.validatorNewPassword = 'bad';
				}
			});

		// Confirm password
		this.actionFormPasswordData.get('confirmPassword').valueChanges
			.subscribe(val => {
				this.actionFormPasswordData.controls['confirmPassword'].setErrors({ validate: false });
				this.validatorNewPassword = 'load';

				if (val.trim() != '') {
					setTimeout(() => {
						if(val == this.actionFormPasswordData.get('newPassword').value){
							this.actionFormPasswordData.controls['newPassword'].setErrors(null);
							this.actionFormPasswordData.controls['confirmPassword'].setErrors(null);
							this.validatorNewPassword = 'done';
						} else {
							this.actionFormPasswordData.controls['confirmPassword'].setErrors({ validate: false });
							this.validatorNewPassword = 'bad';
						}
					}, 1000);
				} else {
					this.actionFormPasswordData.controls['confirmPassword'].setErrors({ validate: false });
					this.validatorNewPassword = 'bad';
				}
			});
	}

	// Change avatar
	openAvatar(type, event) {
		if (type == 1) { // upload
			let file = event.target.files[0];

			if (/^image\/\w+$/.test(file.type)) {
				file = URL.createObjectURL(file);
				this.sessionData.current.avatarCropper = this.sanitizer.bypassSecurityTrustUrl(file);
				this.location.go('/settings#avatar');

				let config = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						translations: this.translations
					}
				};

				let dialogRef = this.dialog.open( SettingsAvatarComponent, config);
				dialogRef.afterClosed().subscribe((res: string) => {
					this.location.go('/settings');

					if (res) {
						this.sessionData = res;
						this.sessionService.setData(this.sessionData);
						this.alertService.success(this.translations.avatarChanged);
					}
				});
			} else {
				this.alertService.error(this.translations.selectedFileIsNotImage);
			}
		} else if (type == 2) { // remove
			this.sessionData.current.newAvatar = '';
			this.userDataService.updateAvatar(this.sessionData.current)
				.subscribe(res => {
					this.sessionData = res;
					this.sessionService.setData(this.sessionData);
					this.alertService.success(this.translations.avatarRemoved);
				});
		}
	}

	// Change background
	openBackground(type, event) {
		if (type == 1) { // upload
			let file = event.target.files[0];

			if (/^image\/\w+$/.test(file.type)) {
				file = URL.createObjectURL(file);
				this.sessionData.current.backgroundCropper = this.sanitizer.bypassSecurityTrustUrl(file);
				this.location.go('/settings#background');

				let config = {
					disableClose: false,
					data: {
						sessionData: this.sessionData,
						translations: this.translations
					}
				};

				let dialogRef = this.dialog.open( SettingsBackgroundComponent, config);
				dialogRef.afterClosed().subscribe((res: string) => {
					this.location.go('/settings');

					if (res) {
						this.sessionData = res;
						this.sessionService.setData(this.sessionData);
						this.alertService.success(this.translations.backgroundChanged);
					}
				});
			} else {
				this.alertService.error(this.translations.selectedFileIsNotImage);
			}
		} else if (type == 2) { // remove
			this.sessionData.current.newBackground = '';
			this.userDataService.updateBackground(this.sessionData.current)
				.subscribe(res => {
					this.sessionData = this.userDataService.getSessionData();
					this.sessionService.setData(this.sessionData);
					this.alertService.success(this.translations.backgroundRemoved);
				});
		}
	}

	// About edit
	aboutEdit(type, event){
		if (type == 'writingChanges') {
			let str = event;
			this.sessionData.current.aboutWriting = event;
			
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
			this.sessionData.current.about = str;

			//check empty contenteditable
			this.aboutEdit('checkPlaceholder', event);
		} else if (type == 'checkPlaceholder') {
			event = event.trim();

			if (event.length == 0)
				this.sessionData.current.about = '<div class="placeholder">' + this.translations.aboutMe + '</div>';
		} else if (type == 'transformBeforeSend') {
			let newData = {
				content: this.sessionData.current.aboutWriting ? this.sessionData.current.aboutWriting : '',
				original: this.sessionData.current.aboutWriting ? this.sessionData.current.aboutWriting : ''
			}

			// new line
			newData.content = newData.content.replace(/\n/g, '<br>');

			// hashtag
			newData.content = newData.content.replace(/(#)\w+/g, function(value){
				return '<a class="hashtag">' + value + '</a>';
			});

			// mention
			newData.content = newData.content.replace(/(@)\w+/g, function(value){
				return '<a class="mention">' + value + '</a>';
			});

			// detect url
			newData.content = newData.content.replace(this.urlRegex, function(value){
				return '<a class="url">' + value + '</a>';
			});

			return newData;
		}
	}

	// Save personal data
	submitPersonal() {
		this.savePersonalDataLoading = true;
		
		let dataAbout = this.aboutEdit('transformBeforeSend', null),
			data = {
				id: this.sessionData.current.id,
				username: this.actionFormPersonalData.get('username').value,
				name: this.actionFormPersonalData.get('name').value.trim(),
				language: this.actionFormPersonalData.get('language').value,
				about: dataAbout.content,
				aboutOriginal: dataAbout.original
			};

		this.userDataService.updateData(data)
			.subscribe(res => {
				setTimeout(() => {
					// Set data
					this.savePersonalDataLoading = false;
					this.sessionData = this.userDataService.getSessionData();
					this.sessionService.setData(this.sessionData);

					// Get translations
					this.userDataService.getTranslations(this.sessionData.current.language)
						.subscribe(data => {
							this.translations = data;

							// Alert Message
							this.alertService.success(data.profileSaved);
						});
				}, 1000);
			}, error => {
				this.savePersonalDataLoading = false;
				this.alertService.error(this.translations.anErrorHasOcurred);
			});
	}

	// Save password data
	submitPassword() {
		this.savePasswordDataLoading = true;

		let data = {
			id: this.sessionData.current.id,
			oldPassword: this.actionFormPasswordData.get('oldPassword').value,
			newPassword: this.actionFormPasswordData.get('newPassword').value
		}

		this.userDataService.updatePassword(data)
			.subscribe(res => {
				setTimeout(() => {
					this.validatorOldPassword = 'done';
					this.savePasswordDataLoading = false;
					this.alertService.success(this.translations.passwordChanged);
				}, 1000);
			}, error => {
				this.validatorOldPassword = 'bad';
				this.savePasswordDataLoading = false;
				this.alertService.error(this.translations.oldPasswordIncorrect);
			});
	}

	// Add more sessions
	openNewSession(){
		let dONS = {
			type: 'create',
			data: {
				sessionData: this.sessionData,
				translations: this.translations,
			}
		}

		this.sessionService.setDataAddAccount(dONS);
	}

	// Change user session
	setCurrentUser(data){
		if (this.sessionData.current.id != data.id) {
			let dSCU = {
				type: 'set',
				data: data
			}

			this.sessionService.setDataAddAccount(dSCU);
		}
	}

	// Close session
	closeSession(data){
		let dCS = {
			type: 'close',
			data: data
		}

		this.sessionService.setDataAddAccount(dCS);
	}
}

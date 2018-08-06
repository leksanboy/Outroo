import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var ga: Function;
declare var grecaptcha: any;

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html'
})

export class SigninComponent implements OnInit {
	public environment: any = environment;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public showPassword: boolean;
	public recaptcha: boolean;
	public reCaptchaExists: boolean;

	constructor(
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private titleService: Title,
		private alertService: AlertService,
		private userDataService: UserDataService
	) {
		// Refresh page to show recaptcha
		// this.refreshPage();

		// reCaptcha
		let self = this;
		window['onloadCallback'] = function() {
			// Unset recaptcha message
			self.reCaptchaExists = true;

			// Get data
			grecaptcha.render('reCaptcha_element', {
				'sitekey' : self.environment.reCaptcha,
				'callback': (res: string) => { 
								self.verifyReCaptcha(res);
							},
				'expired-callback': () => {
					self.verifyReCaptcha(null);
				}
			});
		};

		// Reload page, check if not exists to show reCaptcha
		setTimeout(() => {
			if (!this.reCaptchaExists)
				this.alertService.warning('Please reload the page, thanks!');
		}, 1200);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'signin';
		ga('set', 'page', urlGa);
		ga('send', 'pageview');

		// Set page title
		this.titleService.setTitle('Sign In | Login');

		// login form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});

		// destroy session & reset login
		this.userDataService.logout();
	}

	verifyReCaptcha(data){
		this.recaptcha = data ? true : false;
	}

	refreshPage(){
		window.location.reload();
	}

	submit(ev: Event) {
		this.submitLoading = true;

		if (this.actionForm.get('email').value.trim().length > 0 &&
			this.actionForm.get('password').value.trim().length > 0 &&
			this.recaptcha
		) {
			this.userDataService.login(this.actionForm.get('email').value, this.actionForm.get('password').value)
				.subscribe(
					(res: any) => {
						this.router.navigate([res.username]);
						// window.location.href='https://outhroo.com/' + res.username;
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.error('Email or Password is incorrenct');

						// reset reCaptcha
						this.recaptcha = false;
						grecaptcha.reset();
					}
				);
		} else {
			this.submitLoading = false;

			// show error message
			this.alertService.error('Complete all fields and reCAPTCHA');
		}
	}
}

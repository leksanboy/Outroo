import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData';

declare var ga: Function;
declare var grecaptcha: any;

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public environment: any = environment;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public pageStatus: string = 'default';
	public email: string;
	public recaptcha: boolean;
	public reCaptchaExists: boolean;

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userDataService: UserDataService,
		private alertService: AlertService
	) {
		// // reCaptcha
		// window['verifyCallbackReCaptcha'] = this.verifyReCaptcha.bind(this);

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
				this.alertService.success('Please reload the page, thanks!');
		}, 1200);
	}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'forgot-password';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

    	// Set page title
		this.titleService.setTitle('Forgot password | Recover account access');

		// forgot password form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
		});

		// destroy session & reset login
		this.userDataService.logout();
	}

	verifyReCaptcha(data){
		this.recaptcha = data ? true : false;
	}

	submit(ev: Event) {
		this.submitLoading = true;
		this.email = this.actionForm.get('email').value;

		if (this.actionForm.get('email').value.trim().length > 0 && 
			this.recaptcha
		) {
			this.userDataService.forgotPassword(this.actionForm.get('email').value)
				.subscribe(
					res => {
						this.submitLoading = false;

						// show text -> done
						this.pageStatus = 'completed';
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.success('Email does not exist');

						// reset reCaptcha
						this.recaptcha = false;
						grecaptcha.reset();
					}
				);
		} else {
			this.submitLoading = false;

			// show success message
			this.alertService.success("Complete the email and reCAPTCHA");
		}
	}
}

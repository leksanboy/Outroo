import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData.service';

declare var ga: Function;

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
    private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public environment: any = environment;
	public actionForm: FormGroup;
	public submitLoading: boolean;
    public signinLoading: boolean;
    public showPassword: boolean;
    public showConfirmPassword: boolean;
    public userData: any = [];
    public pageStatus: string = 'default';
    public recaptcha: boolean;
    public translations: any = [];

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
        private alertService: AlertService,
		private userDataService: UserDataService
	) {
        // Get translations
        this.getTranslations(1);

        // Get url data
        let urlData: any = this.activatedRoute.snapshot;
        let data = {
            code: urlData.params.code
        }

        this.userDataService.resetPassword(data)
            .subscribe(
                (res: any) => {
                    this.userData = res;
                    this.userData.code = data.code;
                    this.pageStatus = 'default';
                },
                error => {
                    this.pageStatus = 'error';
                }
            );
    }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'reset-password';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

    	// Set page title
		this.titleService.setTitle('Reset password');

		// login form
		this.actionForm = this._fb.group({
			password: ['', [Validators.required]],
			confirmPassword: ['', [Validators.required]],
            recaptcha: ['', [Validators.required]]
		});
	}

    // Get translations
    getTranslations(lang){
        this.userDataService.getTranslations(lang)
            .subscribe(data => {
                this.translations = data;
            });
    }

    // Verify recaptcha
    verifyReCaptcha(data){
        this.recaptcha = data ? true : false;
    }

    // Submit
	submit(ev: Event) {
		this.submitLoading = true;

        if (this.actionForm.get('password').value.length > 0 &&
            this.actionForm.get('confirmPassword').value.length > 0 &&
            this.recaptcha
		) {
            if(this.actionForm.get('password').value === this.actionForm.get('confirmPassword').value){
                let data = {
                    code: this.userData.code,
                    email: this.userData.email,
                    username: this.userData.username,
                    password: this.actionForm.get('password').value
                }

                this.userDataService.updateResetPassword(data)
                    .subscribe(
                        (res: any) => {
                            this.pageStatus = 'completed';
                        },
                        error => {
                            this.submitLoading = false;

                            // show error message
        					this.alertService.error(this.translations.anErrorHasOcurred);

                            // reset reCaptcha
                            this.recaptcha = false;
                        }
                    );
            } else {
                this.submitLoading = false;
                this.alertService.error(this.translations.fieldsNotMatch);
            }
        } else {
			this.submitLoading = false;

			// show error message
			this.alertService.error(this.translations.completeAllFieldsRecaptcha);
		}
	}

    // Sign in
    signin(ev: Event) {
		this.signinLoading = true;

        if (this.userData.email.length > 0 &&
            this.actionForm.get('password').value.length > 0) {
			this.userDataService.login(this.userData.email, this.actionForm.get('password').value)
				.subscribe(
					res => {
						this.router.navigate(['/']);
					},
					error => {
						this.signinLoading = false;

						// show error message
						this.alertService.error(this.translations.anErrorHasOcurred);

                        // reset recaptcha
                        this.recaptcha = false;
					}
				);
		} else {
			this.signinLoading = false;

			// show error message
			this.alertService.error(this.translations.completeAllFieldsRecaptcha);
		}
	}
}

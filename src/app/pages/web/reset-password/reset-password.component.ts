import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData';

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
    public pageStatus: string = '';

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
        private alertService: AlertService,
		private userDataService: UserDataService
	) {
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

	submit(event:Event) {
		this.submitLoading = true;

        if (this.actionForm.get('password').value.length > 0 &&
            this.actionForm.get('confirmPassword').value.length > 0 &&
            this.actionForm.get('recaptcha').value
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
        					this.alertService.success('Unexpected error has ocurred.');

                            // reset recaptcha
                            this.actionForm.get('recaptcha').setValue('');
                        }
                    );
            } else {
                this.submitLoading = false;
                this.alertService.success('The fields not match, is incorrenct');
            }
        } else {
			this.submitLoading = false;

			// show error message
			this.alertService.success('Complete all fields and reCAPTCHA');
		}
	}

    signin() {
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
						this.alertService.success('Unexpected error has ocurred.');
					}
				);
		} else {
			this.signinLoading = false;

			// show error message
			this.alertService.success('Unexpected error has ocurred.');
		}
	}
}

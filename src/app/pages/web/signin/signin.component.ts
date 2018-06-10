import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData';

declare var ga: Function;

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})

export class SigninComponent implements OnInit {
	public actionForm: FormGroup;
	public submitLoading: boolean;
    public showPassword: boolean;

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
        private alertService: AlertService,
		private userDataService: UserDataService
	) {}

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
			password: ['', [Validators.required]],
			recaptcha: ['', [Validators.required]]
		});

		// destroy session & reset login
		this.userDataService.logout();
	}

	submit(event:Event) {
		this.submitLoading = true;

        if (this.actionForm.get('email').value.trim().length > 0 &&
            this.actionForm.get('password').value.trim().length > 0 &&
            this.actionForm.get('recaptcha').value
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
    					this.alertService.success('Email or Password is incorrenct');

    					// reset recaptcha
    					this.actionForm.get('recaptcha').setValue('');
    				}
    			);
        } else {
			this.submitLoading = false;

			// show error message
			this.alertService.success('Unexpected error has ocurred.');
		}
	}
}

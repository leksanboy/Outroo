import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../app/core/services/user/userData';

declare var ga: Function;

@Component({
	selector: 'app-support',
	templateUrl: './support.component.html'
})

export class SupportComponent implements OnInit {
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public pageStatus: string = 'default';
	public email: string;

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userDataService: UserDataService,
		private alertService: AlertService
	) {}

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'support';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

    	// Set page title
		this.titleService.setTitle('Support');

		// Form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
			content: ['', [Validators.required]],
			recaptcha: ['', [Validators.required]]
		});

		// destroy session & reset login
		this.userDataService.logout();
	}

	submit(event:Event) {
		this.submitLoading = true;
		this.email = this.actionForm.get('email').value;

		if (this.actionForm.get('email').value.trim().length > 0 && this.actionForm.get('content').value.trim().length > 0 && this.actionForm.get('recaptcha').value) {
			let data = {
				email: this.actionForm.get('email').value,
				content: this.actionForm.get('content').value
			}

			this.userDataService.supportQuestion(data)
				.subscribe(
					res => {
						this.submitLoading = false;

						// show text -> done
						this.pageStatus = 'completed';
					},
					error => {
						this.submitLoading = false;

						// show error message
						this.alertService.success('Email does not exist.');

						// reset recaptcha
						this.actionForm.get('recaptcha').setValue('');
					}
				);
		} else {
			this.submitLoading = false;

			// show success message
			this.alertService.success("Complete the email and reCAPTCHA");
		}
	}
}

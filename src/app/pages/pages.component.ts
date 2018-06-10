import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertService } from '../../app/core/services/alert/alert.service';
import { UserDataService } from '../../app/core/services/user/userData';

declare var ga: Function;

@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit {
	public actionForm: FormGroup;
	public submitLoading: boolean;
	public showPassword: boolean;
	public sessionData: any = [];
	public copyright: string = '© ' + new Date().getFullYear() + ' Outhroo';

	constructor(
		private titleService: Title,
		private _fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private userDataService: UserDataService,
		private alertService: AlertService
	) { }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'signin';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

		// login form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});

		// Set page title
		this.titleService.setTitle('Outhroo');

		// Get session data
		this.sessionData = this.userDataService.getSessionData();

		// If session is set
		if (this.sessionData)
			if (this.sessionData.current)
				this.router.navigate([this.sessionData.current.username]);
	}

	submit(event:Event) {
		this.submitLoading = true;

		this.userDataService.login(this.actionForm.get('email').value, this.actionForm.get('password').value)
			.subscribe(
				res => {
					this.router.navigate(['home']);
					// this.router.navigate([res.username]);
					// window.location.href = 'https://outhroo.com/' + res.username;
				},
				error => {
					this.submitLoading = false;

					// show error message
					this.alertService.success('Email or Password is incorrenct.');
				}
			);
	}
}

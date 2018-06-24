import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';

import { AlertService } from '../../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../../app/core/services/user/userData.service';

@Component({
	selector: 'app-session',
	templateUrl: './session.component.html'
})
export class SettingsSessionComponent implements OnInit {
	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public actionForm: FormGroup;
	public saveLoading: boolean;
	public inUse: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<SettingsSessionComponent>,
		private alertService: AlertService,
		private userDataService: UserDataService,
		private _fb: FormBuilder
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;
	}

	ngOnInit() {
		// New session account
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});
	}

	submit(event: Event){
		this.inUse = false;

		for (let i in this.sessionData.sessions)
			if (this.actionForm.get('email').value == this.sessionData.sessions[i].email)
				this.inUse = true;

		if (!this.inUse) {
			this.saveLoading = true;

			this.userDataService.loginNewSession(this.actionForm.get('email').value, this.actionForm.get('password').value)
				.subscribe(res => {
					this.dialogRef.close(res);
					this.saveLoading = false;
				}, error => {
					this.saveLoading = false;
					this.alertService.error(this.translations.emailOrPasswordIncorrect);
				});
		} else {
			this.alertService.error(this.translations.emailAlreadySigned);
		}
	}
}

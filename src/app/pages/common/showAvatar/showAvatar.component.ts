import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-showAvatar',
	templateUrl: './showAvatar.component.html'
})
export class ShowAvatarComponent implements OnInit {
	public environment: any = environment;
	public userData: any = [];
	public translations: any = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ShowAvatarComponent>
	) {
		this.userData = this.data.userData;
		this.translations = this.data.translations;
	}

	ngOnInit() {
		// No init
	}

	// Close
	close(){
		this.dialogRef.close();
	}
}

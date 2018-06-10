import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../../../environments/environment';

import { AlertService } from '../../../../../app/core/services/alert/alert.service';
import { UserDataService } from '../../../../../app/core/services/user/userData';

declare var Cropper: any;

@Component({
	selector: 'app-avatar',
	templateUrl: './avatar.component.html'
})
export class SettingsAvatarComponent implements OnInit {
	@ViewChild('imageSrc') input: ElementRef;

	public environment: any = environment;
	public sessionData: any = [];
	public translations: any = [];
	public cropperData: any;
	public flipHrz: boolean;
	public flipVrt: boolean;
	public saveLoading: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<SettingsAvatarComponent>,
		private alertService: AlertService,
		private userDataService: UserDataService
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;
	}

	ngOnInit() {
		// no init
	}

	// load image to crop
	imageLoad() {
		this.cropperData = new Cropper(this.input.nativeElement, {
			viewMode: 3,
			aspectRatio: 1 / 1,
			dragMode: 'move',
			modal: true,
			guides: true,
			highlight: true,
			background: true,
			autoCrop: true,
			autoCropArea: 0.7,
			responsive: true
		});
	}

	// cropper functions
	cropperFunctions(type) {
		switch(type) {
			case 'zoomIn':
				this.cropperData.zoom(0.1);
				break;
			case 'zoomOut':
				this.cropperData.zoom(-0.1);
				break;
			case 'rotateLeft':
				this.cropperData.rotate(-90);
				break;
			case 'rotateRight':
				this.cropperData.rotate(90);
				break;
			case 'flipHorizontal':
				this.flipHrz = !this.flipHrz;
				this.flipHrz ? this.cropperData.scaleX(-1) : this.cropperData.scaleX(1);
				break;
			case 'flipVertical':
				this.flipVrt = !this.flipVrt;
				this.flipVrt ? this.cropperData.scaleY(-1) : this.cropperData.scaleY(1);
				break;
			case 'close':
				this.dialogRef.close(null);
				break;
			case 'crop':
				let imageBase64 = this.cropperData.getCroppedCanvas({
					width: 164,
					height: 164,
					fillColor: '#fff',
					imageSmoothingEnabled: false,
					imageSmoothingQuality: 'high'
				}).toDataURL('image/jpeg');

				this.saveLoading = true;

				let d = {
					id: this.sessionData.current.id,
					image: imageBase64
				}

				this.userDataService.updateAvatar(d)
					.subscribe(res => {
						setTimeout(() => {
							this.saveLoading = false;
							this.dialogRef.close(res);
						}, 1000);
					}, error => {
						this.saveLoading = false;
						this.alertService.error(this.translations.anErrorHasOcurred);
					});
				break;
		}
	}
}

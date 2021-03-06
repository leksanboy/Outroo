import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

import { AlertService } from '../../../../app/core/services/alert/alert.service';
import { AudioDataService } from '../../../../app/core/services/user/audioData.service';

declare var Cropper: any;

@Component({
	selector: 'app-newPlaylist',
	templateUrl: './newPlaylist.component.html'
})
export class NewPlaylistComponent implements OnInit {
	@ViewChild('imageSrc') inputImage: ElementRef;

	public sessionData: any = [];
	public translations: any = [];
	public environment: any = environment;
	public cropperData: any;
	public flipHrz: boolean;
	public flipVrt: boolean;
	public saveLoading: boolean;
	public actionForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NewPlaylistComponent>,
		private sanitizer: DomSanitizer,
		private _fb: FormBuilder,
		private alertService: AlertService,
		private audioDataService: AudioDataService
	) {
		this.sessionData = data.sessionData;
		this.translations = data.translations;
		this.data.current = data.item ? data.item : null;

		if (this.data.type == 'edit') {
			this.actionForm = this._fb.group({
				title: [this.data.current.title, [Validators.required]]
			});
		} else if (this.data.type == 'create') {
			this.actionForm = this._fb.group({
				title: ['', [Validators.required]]
			});
		}
	}

	ngOnInit() {
		// not in use
	}

	// load image to crop
	imageLoad() {
		this.cropperData = new Cropper(this.inputImage.nativeElement, {
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

	// upload image
	upload(type, event) {
		let file = event.target.files[0];

		if (/^image\/\w+$/.test(file.type)) {
			file = URL.createObjectURL(file);
			this.data.newImage = this.sanitizer.bypassSecurityTrustUrl(file);

			setTimeout(() => {
				this.imageLoad();
			}, 100);
		} else {
			this.alertService.error(this.translations.fileIsNotImage);
		}
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
		}
	}

	// remove cover
	removeCover(){
		this.data.image = null;
	}

	// save edit
	save(){
		switch(this.data.type) {
			case 'create':
				if (this.actionForm.get('title').value.trim().length > 0) {
					this.saveLoading = true;

					if (this.data.newImage) {
						let imageB64 = this.cropperData.getCroppedCanvas({
							width: 240,
							height: 240,
							fillColor: '#fff',
							imageSmoothingEnabled: false,
							imageSmoothingQuality: 'high'
						}).toDataURL('image/jpeg');

						this.data.newImage = imageB64;
					} else {
						this.data.newImage = '';
					}

					let data = {
						type: 'create',
						user: this.sessionData.current.id,
						title: this.actionForm.get('title').value,
						image: this.data.newImage
					}

					this.audioDataService.createPlaylist(data)
						.subscribe(res => {
							this.saveLoading = false;
							this.dialogRef.close(res.json());
						});
				} else {
					// show error message
					this.alertService.error(this.translations.completeAllFields);
				}
				break;
			case 'edit':
				if (this.actionForm.get('title').value.trim().length > 0) {
					this.saveLoading = true;

					// Crop new image
					if (this.data.newImage) {
						let imageB64 = this.cropperData.getCroppedCanvas({
							width: 240,
							height: 240,
							fillColor: '#fff',
							imageSmoothingEnabled: false,
							imageSmoothingQuality: 'high'
						}).toDataURL('image/jpeg');

						this.data.newImage = imageB64;
					} else {
						this.data.newImage = '';
					}

					// Data
					let data;
					if (this.data.newImage) {
						data = {
							type: 'update',
							subtype: 'updateNewImage',
							id: this.data.current.id,
							user: this.sessionData.current.id,
							title: this.actionForm.get('title').value,
							color: this.data.current.color,
							image: this.data.newImage
						}
					} else {
						if (this.data.current.image)
							data = {
								type: 'update',
								subtype: 'updateTitle',
								id: this.data.current.id,
								user: this.sessionData.current.id,
								title: this.actionForm.get('title').value,
								color: this.data.current.color
							}
						else
							data = {
								type: 'update',
								subtype: 'updateTitleImage',
								id: this.data.current.id,
								user: this.sessionData.current.id,
								title: this.actionForm.get('title').value,
								color: this.data.current.color
							}
					}

					this.audioDataService.createPlaylist(data)
						.subscribe((res: any) => {
							this.saveLoading = false;
							res = res.json();
							res.index = this.data.current.index;

							this.dialogRef.close(res);
						});
				} else {
					// show error message
					this.alertService.error(this.translations.completeAllFields);
				}
				break;
		}
	}

	// Close
	close(){
		this.dialogRef.close();
	}
}

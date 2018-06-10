import { Component, OnInit} from '@angular/core'
import { trigger, transition, style, animate, state } from '@angular/animations';

import { Alert } from './alert.model';
import { AlertService } from './alert.service';

@Component({
	selector: 'alert',
	templateUrl: 'alert.component.html',
	animations: [
		trigger(
			'myAnimation',
			[
				transition(
					':enter', [
						style({transform: 'translateY(100%)', opacity: 0}),
						animate('300ms', style({transform: 'translateY(0)', 'opacity': 1}))
					]
				),
				transition(
					':leave', [
						style({transform: 'translateY(0)', 'opacity': 1}),
						animate('300ms', style({transform: 'translateY(100%)', 'opacity': 0}))
					]
				)
			]
		)
	]
})

export class AlertComponent {
	public alerts: Alert[] = [];

	constructor(
		private alertService: AlertService
	) { }

	ngOnInit() {
		this.alertService.getData()
			.subscribe((alert: Alert) => {
				if (!alert){
					this.alerts = [];
					return;
				}

				this.alerts = []; // clear all for show only one
				this.alerts.push(alert);

				setTimeout(() => {
					this.close(alert);
				}, 3000);
			});
	}

	close(alert: Alert) {
		this.alerts = this.alerts.filter(x => x !== alert);
	}
}

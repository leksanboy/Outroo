import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

declare var ga: Function;

@Component({
	selector: 'app-terms',
	templateUrl: './terms.component.html'
})

export class TermsComponent implements OnInit {

	constructor(
		private titleService: Title,
	) { }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'terms';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

    	// Set page title
		this.titleService.setTitle('Terms');
	}
}

import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

declare var ga: Function;

@Component({
	selector: 'app-brand',
	templateUrl: './brand.component.html'
})

export class BrandComponent implements OnInit {

	constructor(
		private titleService: Title,
	) { }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'brand';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

    	// Set page title
		this.titleService.setTitle('Brand');
	}
}

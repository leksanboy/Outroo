import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

declare var ga: Function;

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html'
})

export class AboutComponent implements OnInit {

	constructor(
		private titleService: Title,
	) { }

	ngOnInit() {
		// Set Google analytics
		let urlGa = 'about';
    	ga('set', 'page', urlGa);
    	ga('send', 'pageview');

    	// Set page title
		this.titleService.setTitle('About us');
	}

	downloadAssetPack(){
		window.location.href = 'https://outhroo.com/assets/images/Asset_pack.zip';
	}
}

import { DOCUMENT, Title, Meta } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class MetaService {
    constructor(
    	@Inject(DOCUMENT) private document: Document,
    	private title: Title,
    	private meta: Meta
    ) { }

    setData(data: any) {
        console.log("META", data);
    	// Set title
    	this.title.setTitle(data.page);

        // Meta tags
		this.meta.updateTag({name: 'title', 				property: 'title',			content: data.title});
		this.meta.updateTag({name: 'description', 			property: 'description',	content: data.description});
		this.meta.updateTag({name: 'keywords', 				property: 'keywords',		content: data.keywords});
		this.meta.updateTag({itemtype: data.url});

		// Open Graph protocol
		this.meta.updateTag({property: 'og:url', 			content: data.url});
		this.meta.updateTag({property: 'og:title', 			content: data.title});
		this.meta.updateTag({property: 'og:description', 	content: data.description});
		this.meta.updateTag({property: 'og:image', 			content: data.image});

        // Twitter
        this.meta.updateTag({name: 'twitter:title',     content: data.title});
		this.meta.updateTag({name: 'twitter:description', content: data.description});
    }
}

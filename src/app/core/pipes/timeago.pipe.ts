import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment/moment';

@Pipe({
	name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {
	transform(value: any, args?: any): any {
        moment.updateLocale('en', {
            relativeTime : {
                future: "in %s",
                past:   "%s",
                s:      "%d\s",
                ss:     "%d\s",
                m:      "%d\m",
                mm:     "%d\m",
                h:      "%d\h",
                hh:     "%d\h",
                d:      "%d\d",
                dd:     "%d\d",
                M:      "%d\M",
                MM:     "%d\M",
                y:      "%d\Y",
                yy:     "%d\Y"
            }
        });

        let time = moment(moment.parseZone(value)).fromNow();
        return time;
	}
}

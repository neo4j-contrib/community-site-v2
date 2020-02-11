import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getCanYouHelp = () =>  {
     return new Promise((resolve, reject) => {
          ajax(`/search.json?${Discourse.SiteSettings.neo4j_can_you_help_search_criteria}`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getCanYouHelp } ;


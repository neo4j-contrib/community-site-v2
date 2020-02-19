import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getLatestTopics = (category_id) =>  {
     return new Promise((resolve, reject) => {
            ajax(`/c/${category_id}.json`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getLatestTopics } ;
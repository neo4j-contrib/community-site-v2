import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getLatestTopics = (category_id, quantity) =>  {
     return new Promise((resolve, reject) => {
          ajax(`/latest_topics.json?category_id=${category_id}&quantity=${quantity}`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getLatestTopics } ;
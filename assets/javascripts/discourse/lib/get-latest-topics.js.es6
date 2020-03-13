import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getLatestTopics = (data_class) =>  {
     return new Promise((resolve, reject) => {
            ajax(`/${data_class}.json`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getLatestTopics } ;
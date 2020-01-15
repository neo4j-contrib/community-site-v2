import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getAnnouncementTopics = () =>  {
     return new Promise((resolve, reject) => {
          ajax(`/announcementtopics.json`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getAnnouncementTopics } ;
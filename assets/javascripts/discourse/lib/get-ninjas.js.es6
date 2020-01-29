import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getNinjas = () =>  {
     return new Promise((resolve, reject) => {
          ajax(`/ninjas.json`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getNinjas } ;
import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getCertifiedDevs = () =>  {
     return new Promise((resolve, reject) => {
          ajax(`/certified_devs.json`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getCertifiedDevs } ;

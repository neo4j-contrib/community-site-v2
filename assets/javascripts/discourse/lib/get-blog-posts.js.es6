import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getBlogPosts = () =>  {
     return new Promise((resolve, reject) => {
          ajax("/wpblogposts.json").then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

let getBlogAuthor = (id) =>  {
     return new Promise((resolve, reject) => {
          ajax(`/wpblogauthor.json?id=${id}`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getBlogPosts, getBlogAuthor } ;
import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getLatestBlogPost = () =>  {
     return new Promise((resolve, reject) => {
          ajax("/wplatestblogpost.json").then(result => {
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

let getFeaturedMember = () =>  {
     return new Promise((resolve, reject) => {
          ajax(`/wpfeaturedmember.json`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getLatestBlogPost, getBlogAuthor, getFeaturedMember } ;
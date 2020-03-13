import { ajax } from 'discourse/lib/ajax';
import { Promise } from "rsvp";

let getLatestBlogPost = () =>  {
     return new Promise((resolve, reject) => {
          ajax("/wp_latest_blogpost.json").then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

let getBlogAuthor = (id) =>  {
     return new Promise((resolve, reject) => {
          ajax(`/wp_blog_author.json?id=${id}`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

let getFeaturedMember = () =>  {
     return new Promise((resolve, reject) => {
          ajax(`/wp_featured_member.json`).then(result => {
            resolve(result)
          }).catch((err) => {
            reject([]);
          })
        });
      }

export { getLatestBlogPost, getBlogAuthor, getFeaturedMember } ;
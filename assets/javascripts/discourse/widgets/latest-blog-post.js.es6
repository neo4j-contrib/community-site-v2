import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getBlogPosts, getBlogAuthor } from '../lib/get-blog-posts';

export default createWidget('latest-blog-post', {
  tagName: "div.latest-blog-post",
  buildKey: () => 'latest-blog-post',

  defaultState() {
    return {
      blogposts: null,
      loaded: false,
      loading: false
    };
  },

  refreshPosts(state) {
    if (this.loading) { return; }

    state.loading = true;

    getBlogPosts().then((result) => {

      if (result.length) {
        state.blogposts = result.filter((blogpost) => {
          return blogpost.tags.includes(Discourse.SiteSettings.neo4j_blog_post_filter_tag_id)
        });
        
        if (state.blogposts[0]) {
          getBlogAuthor(state.blogposts[0].author).then((result) => {

            if (result.name) {
              state.blogposts[0].authors_name = result.name;
              state.blogposts[0].authors_url = result.link;
            } else {
              state.blogposts[0].authors_name = '';
              state.blogposts[0].authors_url = '';
            }
            state.loading = false;
            state.loaded = true;
            this.scheduleRerender();
          })
        };
      } else {
        state.blogposts = [];
      }
    });
  },

  html(args, state) {

    function unescapeHtml(safe) {
      return $('<div />').html(safe).text();
    }

    if (!state.loaded) {
      this.refreshPosts(state);
    }

    if (state.loading) {
      return [h("div.spinner-container", h("div.spinner"))];
    }

    var buffer = [];
    var blogpost = state.blogposts[0];

    if (blogpost) {
          buffer = h("div.latest-blog-post-entry",
            [h("h5",
              h("a", {
                  "attributes": {
                    "href": `${blogpost.link}`,
                    "rel": "noopener",
                    "target":"_blank"
                    }
                },
              h("span.latest-blog-post-title",
                `${ unescapeHtml(blogpost.title.rendered)}` ))),
              h("div.latest-blog-post-author-container",
                h("a", {
                    "attributes": {
                      "href": `${blogpost.authors_url}`,
                      "rel": "noopener",
                      "target":"_blank"
                      }
                  },
                h("div.latest-blog-post-author-name",
                        `${blogpost.authors_name}` ))),
              h("div.latest-blog-post-date",
                        `${moment(blogpost.date).format("MMM Do")}`),
              //h("br"),
              h("div.latest-blog-post-excerpt",
                `${unescapeHtml(blogpost.excerpt.rendered)}`)
            ]
          )
        }
    return h('div.latest-blog-post-inner', [h('h3',`${I18n.t('neo4j.widgets.blog_post.title')}`) ,buffer]);
   }
});
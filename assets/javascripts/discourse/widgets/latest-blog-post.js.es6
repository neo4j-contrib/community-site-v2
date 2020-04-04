import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getLatestBlogPost, getBlogAuthor } from '../lib/get-blog-posts';

export default createWidget('latest-blog-post', {
  tagName: "div.latest-blog-post.neo4j-widget-sidebar",
  buildKey: () => 'latest-blog-post',

  defaultState() {
    return {
      blogpost: null,
      loaded: false,
      loading: false
    };
  },

  refreshPosts(state) {
    if (this.loading) { return; }

    state.loading = true;

    getLatestBlogPost().then((result) => {

      if (result.id) {

        state.blogpost = result;
        
        if (state.blogpost) {
          getBlogAuthor(state.blogpost.author).then((result) => {

            if (result.name) {
              state.blogpost.authors_name = result.name;
              state.blogpost.authors_url = result.link;
            } else {
              state.blogpost.authors_name = '';
              state.blogpost.authors_url = '';
            }
            state.loading = false;
            state.loaded = true;
            this.scheduleRerender();
          })
        };
      } else {
        state.blogpost = {};
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
    var blogpost = state.blogpost;

    if (blogpost) {

        var bullets = []

        blogpost.bullets.forEach (bullet => {
          bullets.push(h("li",
              h("a", {
                  "attributes": {
                    "href": bullet.link,
                    "rel": "noopener",
                    "target":"_blank"
                    }
                },
                h("span.latest-blog-post-bullet-title", unescapeHtml(bullet.title))
              )
            )
          )
        });

        buffer = h("div.latest-blog-post-entry",
          [
            h("h5",
              h("a", {
                  "attributes": {
                    "href": blogpost.link,
                    "rel": "noopener",
                    "target":"_blank"
                    }
                },
                h("span.latest-blog-post-title", unescapeHtml(blogpost.title))
              )
            ),
            h("div.latest-blog-post-author",
              h("a", {
                  "attributes": {
                    "href": blogpost.authors_url,
                    "rel": "noopener",
                    "target":"_blank"
                    }
                },
                h("div.latest-blog-post-author-name", blogpost.authors_name)
              )
            ),
            h("div.latest-blog-post-date", moment(blogpost.date).format("MMM Do")),
            h("div.latest-blog-post-bullets", bullets)
          ]
        )
      }
    return h('div.latest-blog-post-inner', [h('h3.neo4j-widget-sidebar-header', I18n.t('neo4j.widgets.blog_post.title')) ,buffer]);
  }
});
import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getFeaturedMember } from '../lib/get-blog-posts';

export default createWidget('featured-member', {
  tagName: "div.featured-member",
  buildKey: () => 'featured-member',

  defaultState() {
    return {
      featured_member: null,
      loaded: false,
      loading: false
    };
  },

  refreshPosts(state) {
    if (this.loading) { return; }

    state.loading = true;

    getFeaturedMember().then((result) => {

      if (result.image_source) {

          state.featured_member = result;
        
          state.loading = false;
          state.loaded = true;
          this.scheduleRerender();
  
      } else {
        state.featured_member = {};
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
    var featured_member = state.featured_member;

    if (featured_member) {
      buffer = h("div.featured-member-container", [
        h("div.featured-member-image",
          (h("a", {
            "attributes": {
              "href": featured_member.link,
              "rel": "noopener",
              "target":"_blank"
            }
            },
            h("img", {
              attributes: {
                "src" : featured_member.image_source
              }
            })
          ))
        ),
        h("div.featured-member-fixed-image",
          (h("a", {
            "attributes": {
              "href": Discourse.SiteSettings.neo4j_featured_member_fixed_image_link,
              "rel": "noopener",
              "target":"_blank"
            }
            },
            h("img", {
              attributes: {
                "src" : Discourse.SiteSettings.neo4j_featured_member_fixed_image_source
              }
            })
          ))
        )
      ])
    }
    return h('div.featured-member-inner.neo4j-widget-main', [h('div.neo4j-widget-main-header', h('h3.neo4j-widget-main-title', I18n.t('neo4j.widgets.featured-member.title'))), buffer]);
  }
});
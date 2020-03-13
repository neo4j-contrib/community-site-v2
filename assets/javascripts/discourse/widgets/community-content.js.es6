import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getLatestTopics } from '../lib/get-latest-topics';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";
import { iconNode } from "discourse-common/lib/icon-library";

export default createWidget('community-content', {
  tagName: "div.community-content",
  buildKey: () => 'community-content',

  defaultState() {
    return {
      topics: null,
      loaded: false,
      loading: false
    };
  },

  refreshTopics(state) {

    if (this.loading) { return; }

    state.loading = true;

    getLatestTopics("community_content").then((result) => {
      if (result) {
          state.topics = result;
      } else {
        state.topics = [];
      }
      state.loading = false;
      state.loaded = true;
      this.scheduleRerender();
    });
  },

  html(args, state) {

    if (!state.loaded) {
      this.refreshTopics(state);
    }

    if (state.loading) {
      return [h("div.spinner-container", h("div.spinner"))];
    }

    var buffer = [];
    var topics = state.topics;

    if (topics !== null) {
      if (topics.length > 0) {

        topics.forEach (topic => {
          buffer.push(
            h("a",
              {
                attributes: {
                  "href": `/t/${topic.id}`,
                  "class": "community-content-entry"
                }
              },
                [
                  h("div.community-content-avatar",
                    avatarImg("medium", {
                      template: topic.avatar_template,
                      username: formatUsername(topic.username)
                    })
                  ),
                  [
                  h("div.community-content-title", topic.title),
                  h("div.community-content-likes",[iconNode("far-heart"),
                  " ", topic.like_count]),
                  h("div.community-content-posts", [iconNode("far-comment"),
                  " ", topic.posts_count - 1]),
                  h("div.community-content-views", [iconNode("far-eye"),
                  " ", topic.views])
                ]
                ]
              )
          )
        })
      }
    }
    return h('div.community-content', [
      h('div.community-content-header', [
        h('h3.community-content-header-title', I18n.t('neo4j.widgets.community-content.title')),
        h('a.community-content-main-link', {
          "attributes": {
            "href": `/c/${Discourse.SiteSettings.neo4j_community_content_category}`
          }
        }, I18n.t('neo4j.widgets.community-content.link-text'))
      ]),
      h('div.community-content-container', buffer)
    ]);
  }
});

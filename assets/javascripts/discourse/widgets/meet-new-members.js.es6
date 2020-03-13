import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getLatestTopics } from '../lib/get-latest-topics';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";
import { iconNode } from "discourse-common/lib/icon-library";

export default createWidget('meet-new-members', {
  tagName: "div.meet-new-members",
  buildKey: () => 'meet-new-members',

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

    getLatestTopics("meet_new_members").then((result) => {
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
                  "class": "meet-new-members-entry"
                }
              },
                [
                  h("div.meet-new-members-avatar",
                    avatarImg("huge", {
                      template: topic.avatar_template,
                      username: formatUsername(topic.username)
                    })
                  ),
                  h("div.meet-new-members-likes",[iconNode("far-heart"),
                  " ", topic.like_count]),
                  h("div.meet-new-members-posts", [iconNode("far-comment"),
                  " ", topic.posts_count - 1]),
                  h("div.meet-new-members-views", [iconNode("far-eye"),
                  " ", topic.views]),
                  h("div.meet-new-members-title", topic.title),
                  h("div.meet-new-members-excerpt", topic.excerpt)
                ]
              )
          )
        })
      }
    }
    return h('div.meet-new-members', [
      h('div.meet-new-members-header', [
        h('h3.meet-new-members-header-title', I18n.t('neo4j.widgets.meet-new-members.title')),
        h('a.meet-new-members-main-link', {
          "attributes": {
            "href": `/c/${Discourse.SiteSettings.neo4j_meet_new_members_category}`
          }
        }, I18n.t('neo4j.widgets.meet-new-members.link-text'))
      ]),
      h('div.meet-new-members-container', buffer)
    ]);
  }
});

import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getLatestTopics } from '../lib/get-latest-topics';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";
import { iconNode } from "discourse-common/lib/icon-library";

export default createWidget('community-projects', {
  tagName: "div.community-projects",
  buildKey: () => 'community-projects',

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

    getLatestTopics(Discourse.SiteSettings.neo4j_community_projects_category,Discourse.SiteSettings.neo4j_community_projects_number_of_entries).then((result) => {
      if (result.length) {
          state.topics = result
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
                    avatarImg("large", {
                      template: topic.avatar_template,
                      username: formatUsername(topic.username)
                    })
                  ),
                  h("div.community-content-title", topic.title),
                  h("div.community-content-meta", 
                  [
                    h("div.topic-likes-count",[iconNode("far-heart"),
                    " ", topic.like_count]),
                    h("div.topic-post-count", [iconNode("far-comment"),
                    " ", topic.posts_count]),
                    h("div.topic-views", [iconNode("far-eye"),
                    " ", topic.views])
                ])
                ]
              )
          )
        })
      }
    }
    return h('div.community-projects', [h('h3', I18n.t('neo4j.widgets.community-projects.title')), h('div.community-content-container', buffer)]);
   }
});

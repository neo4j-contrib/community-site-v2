import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getCanYouHelp } from '../lib/get-can-you-help';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";
import { iconNode } from "discourse-common/lib/icon-library";

export default createWidget('can-you-help', {
  tagName: "div.can-you-help",
  buildKey: () => 'can-you-help',

  defaultState() {
    return {
      topics: null,
      posts: null,
      loaded: false,
      loading: false
    };
  },

  refreshTopics(state) {

    if (this.loading) { return; }

    state.loading = true;

    getCanYouHelp().then((result) => {
      if (result.topics) {
          state.topics = result.topics.slice(0,Discourse.SiteSettings.neo4j_can_you_help_number_of_entries);
          state.posts = result.posts.slice(0,Discourse.SiteSettings.neo4j_can_you_help_number_of_entries);
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
    var posts = state.posts;

    if (topics !== null) {
      if (topics.length > 0) {

        topics.forEach (topic => {

          buffer.push(
            h("a",
              {
                attributes: {
                  "href": `/t/${topic.id}`,
                  "class": "can-you-help-entry"
                }
              },
                [
                  h("div.can-you-help-avatar",
                    avatarImg("small", {
                      template: posts.find(({ topic_id }) => topic_id === topic.id).avatar_template,
                      username: formatUsername(posts.find(({ topic_id }) => topic_id === topic.id).username)
                    })
                  ),
                  h("div.can-you-help-title", topic.title),
                  h("div.can-you-help-meta", 
                  [
                    h("div.topic-post-count", [iconNode("far-comment"),
                    " ", topic.posts_count - 1])
                ])
                ]
              )
          )
        })
      }
    }
    return h('div.can-you-help', [
      h('div.can-you-help-header', [
        h('h3.can-you-help-title', I18n.t('neo4j.widgets.can-you-help.title')),
        h('a.can-you-help-main-link', {
          "attributes": {
            "href": `/search?${Discourse.SiteSettings.neo4j_can_you_help_search_criteria}`
          }
        }, I18n.t('neo4j.widgets.can-you-help.link-text'))
      ]),
      h('div.can-you-help-container', buffer)
    ]);
   }
});

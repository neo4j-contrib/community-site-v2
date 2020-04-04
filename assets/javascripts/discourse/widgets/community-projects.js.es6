import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getLatestTopics } from '../lib/get-latest-topics';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";
import { iconNode } from "discourse-common/lib/icon-library";
import { default as Composer } from 'discourse/models/composer';

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

    getLatestTopics("community_projects").then((result) => {
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

    const createTopic = () => {
      const container = Discourse.__container__;
      const controller = container.lookup("controller:navigation/category");
      const composerController = container.lookup("controller:composer");

      composerController.open({
        action: Composer.CREATE_TOPIC,
        draftKey: Composer.DRAFT,
        categoryId: Discourse.SiteSettings.neo4j_community_projects_category
      });
    }

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
                  "class": "community-content-entry neo4j-widget-main-entry"
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
    return h('div.community-projects.neo4j-widget-main', [
      h('div.community-projects-header.neo4j-widget-main-header', [
        h('h3.community-projects-header-title.neo4j-widget-main-title', I18n.t('neo4j.widgets.community-projects.title')),
        h('a.community-projects-main-link.neo4j-widget-main-main-link', {
          "attributes": {
            "href": `/c/${Discourse.SiteSettings.neo4j_community_projects_category}`
          }
        }, I18n.t('neo4j.widgets.community-projects.link-text')),
      h('button.neo4j-call-to-action-button',
      {
        title: I18n.t('neo4j.widgets.community-projects.button.title'),
        onclick: createTopic
      },
      [h('i.fa-plus.d-icon.d-icon-plus'), h('span.d-button-label', I18n.t('neo4j.widgets.community-projects.button.label'))]
    )
      ]),
      h('div.community-projects-container.neo4j-widget-main-container', buffer)
    ]);
   }
});

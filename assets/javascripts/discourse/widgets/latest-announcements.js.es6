import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getLatestTopics } from '../lib/get-latest-topics';

export default createWidget('latest-announcements', {
  tagName: "div.latest-announcements",
  buildKey: () => 'latest-announcements',

  defaultState() {
    return {
      announcements: null,
      loaded: false,
      loading: false
    };
  },

  refreshAnnouncements(state) {

    if (this.loading) { return; }

    state.loading = true;

    getLatestTopics(Discourse.SiteSettings.neo4j_latest_announcements_category).then((result) => {
      if (result.topic_list) {
          state.announcements = result.topic_list.topics.slice(0,Discourse.SiteSettings.neo4j_latest_announcements_number_of_entries-1);
      } else {
        state.announcements = [];
      }
      state.loading = false;
      state.loaded = true;
      this.scheduleRerender();
    });
  },

  html(args, state) {

    if (!state.loaded) {
      this.refreshAnnouncements(state);
    }

    if (state.loading) {
      return [h("div.spinner-container", h("div.spinner"))];
    }

    var buffer = [];
    var announcements = state.announcements;

    if (announcements !== null) {
      if (announcements.length > 0) {
        announcements.forEach (announcement => {
          buffer.push(h("div.announcements-entry",
              h("li",
                h("a", {
                  "attributes": {
                    "href": `/t/${announcement.id}`
                  }
                },
                  h("span.announcements-entry-title", announcement.title)    
                )
              )
          ))
        })
      }
    }
    return h('div.announcements',
            [h('h3', I18n.t('neo4j.widgets.announcements.title')),
              h('div.announcements-list-container',
                [buffer, 
                 h('div.announcements-view-all',
                  h('a', {
                    "attributes": {
                      "href": `/c/${Discourse.SiteSettings.neo4j_latest_announcements_category}`
                    }
                    }, I18n.t('neo4j.widgets.announcements.link-text')
                  )
                 )
                ]
              )
            ]
          );
  }
});

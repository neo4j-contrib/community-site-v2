import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { ajax } from 'discourse/lib/ajax';
import { getOwner } from 'discourse-common/lib/get-owner';
import { getAnnouncementTopics } from '../lib/get-announcement-topics';
import {
  default as discourseComputed,
  observes,
  on
} from "discourse-common/utils/decorators";
import { alias, and, equal, not } from "@ember/object/computed";
import { inject } from "@ember/controller";

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

    getAnnouncementTopics().then((result) => {
      if (result.length) {
          state.announcements = result.slice(0,4);
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
        for (var i = 0, len = announcements.length; i < len; i++) {
          buffer[i] = h("div.announcements-entry",
            h("li",
              h("a", {
                  "attributes": {
                    "href": `/t/${announcements[i].id}`,//, //uncomment these for new tab
                        // "rel": "noopener",  //uncomment these for new tab
                        // "target":"_blank"   //uncomment these for new tab
                    }
                },
                h("span.announcements-entry-title",
                     `${announcements[i].title}` )
                    
              )
            )
          )
        }
      }
    }
    return h('div.announcements',
            [h('h3',`${I18n.t('neo4j.widgets.announcements.title')}`),
              h('div.announcements-list-container',
                [buffer, 
                 h('div.announcements-view-all',
                  h('a', {
                      "attributes": {
                        "href": `/c/${Discourse.SiteSettings.neo4j_latest_announcements_category}`//, //uncomment these for new tab
                        // "rel": "noopener",  //uncomment these for new tab
                        // "target":"_blank"   //uncomment these for new tab
                        }
                      }, `${I18n.t('neo4j.widgets.announcements.link-text')}`
                    )
                 )
                ]
              )
              ]
            );
   }
});

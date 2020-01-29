import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { ajax } from 'discourse/lib/ajax';
import { getOwner } from 'discourse-common/lib/get-owner';
import { getNinjas } from '../lib/get-ninjas';
import {
  default as discourseComputed,
  observes,
  on
} from "discourse-common/utils/decorators";
import { alias, and, equal, not } from "@ember/object/computed";
import { inject } from "@ember/controller";
import RawHtml from 'discourse/widgets/raw-html';
import hbs from 'discourse/widgets/hbs-compiler';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";

export default createWidget('ninjas', {
  tagName: "div.ninjas",
  buildKey: () => 'ninjas',

  defaultState() {
    return {
      ninjas: null,
      loaded: false,
      loading: false
    };
  },

  refreshNinjas(state) {

    if (this.loading) { return; }

    state.loading = true;

    getNinjas().then((result) => {
      if (result.length) {
          state.ninjas = result;
      } else {
        state.ninjas = [];
      }
      state.loading = false;
      state.loaded = true;
      this.scheduleRerender();
    });
  },


  html(args, state) {

    if (!state.loaded) {
      this.refreshNinjas(state);
    }

    if (state.loading) {
      return [h("div.spinner-container", h("div.spinner"))];
    }

    var buffer = [];
    var ninjas = state.ninjas;

    if (ninjas !== null) {
      if (ninjas.length > 0) {

        ninjas.forEach (ninja => {

          buffer.push(h("div.ninjas-entry",
            h("a",
              {
                attributes: {
                  "class": "ninja-avatar",
                  "data-user-card": ninja.username
                }
              },
                [
                  h("div.ninja-avatar",
                    avatarImg("huge", {
                      template: ninja.avatar_template,
                      username: formatUsername(ninja.username)
                    })
                  ),
                  h("div.ninja-username", ninja.username),
                  h("div.ninja-name", (ninja.name === ninja.username ? "-" : ninja.name)),
                  h("div.ninja-member-since", `${I18n.t('neo4j.widgets.ninjas.since')}: ${moment(ninja.first_seen).format("MMM Do YYYY")}`)
                ]
          )));
          
        })
      }
    };
    return h('div.ninjas', [h('h3',`${I18n.t('neo4j.widgets.ninjas.title')}`), h('div.ninjas-container', buffer)]);
   }
});

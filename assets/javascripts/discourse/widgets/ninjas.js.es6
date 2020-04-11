import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getNinjas } from '../lib/get-ninjas';
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

          buffer.push(h("div.ninjas-entry.neo4j-widget-main-entry",
            h("a",
              {
                attributes: {
                  "class": "ninja-entry-link",
                  "data-user-card": ninja.username
                }
              },
                h("div.ninjas-entry-inner",
                  [
                    h("div.ninja-avatar",
                      avatarImg("medium", {
                        template: ninja.avatar_template,
                        username: formatUsername(ninja.username)
                      })
                    ),
                    h("div.ninja-username", ninja.username),
                    h("div.ninja-name", (ninja.name === ninja.username ? "-" : ninja.name))
                  ]
                )
              )
          ))
        })
      }
    }
    return h('div.ninjas.neo4j-widget-main', [
      h('div.neo4j-widget-main-header', [
        h('h3.neo4j-widget-main-title', I18n.t('neo4j.widgets.ninjas.title')),
        h('a.ninjas-main-link.neo4j-widget-main-main-link', {
          "attributes": {
            "href": Discourse.SiteSettings.neo4j_ninjas_link
          }
        }, I18n.t('neo4j.widgets.ninjas.link-text'))
      ]),
      h('div.ninjas-container.neo4j-widget-main-container', buffer)]);
   }
});

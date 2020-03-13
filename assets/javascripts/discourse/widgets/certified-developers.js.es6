import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getCertifiedDevs } from '../lib/get-certified-devs';
import { avatarImg } from "discourse/widgets/post";
import { formatUsername } from "discourse/lib/utilities";

export default createWidget('certified-developers', {
  tagName: "div.certified-developers",
  buildKey: () => 'certified-developers',

  defaultState() {
    return {
      certified_devs: null,
      loaded: false,
      loading: false
    };
  },

  refreshCertifiedDevs(state) {

    if (this.loading) { return; }

    state.loading = true;

    getCertifiedDevs().then((result) => {
      if (result.length) {
          state.certified_devs = result;
      } else {
        state.certified_devs = [];
      }
      state.loading = false;
      state.loaded = true;
      this.scheduleRerender();
    });
  },

  html(args, state) {

    if (!state.loaded) {
      this.refreshCertifiedDevs(state);
    }

    if (state.loading) {
      return [h("div.spinner-container", h("div.spinner"))];
    }

    var buffer = [];
    var certified_devs = state.certified_devs;

    if (certified_devs !== null) {
      if (certified_devs.length > 0) {

        certified_devs.forEach (certified_dev => {

          buffer.push(h("div.certified-devs-entry",
            h("a",
              {
                attributes: {
                  "class": "certified-dev-avatar",
                  "data-user-card": certified_dev.username
                }
              },
                [
                  h("div.certified-dev-avatar",
                    avatarImg("huge", {
                      template: certified_dev.avatar_template,
                      username: formatUsername(certified_dev.username)
                    })
                  ),
                  h("div.certified-dev-username", certified_dev.username),
                  h("div.certified-dev-name", (certified_dev.name === certified_dev.username ? "-" : certified_dev.name)),
                  h("div.certified-dev-member-since", `${I18n.t('neo4j.widgets.certified-devs.since')}: ${moment(certified_dev.first_seen).format("MMM Do YYYY")}`)
                ]
              )
          ))
        })
      }
    }
    return h('div.certified-devs', [h('h3', I18n.t('neo4j.widgets.certified-devs.title')), h('div.certified-devs-container', buffer)]);
   }
});

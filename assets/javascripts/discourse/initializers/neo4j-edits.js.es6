import { setDefaultHomepage } from "discourse/lib/utilities";
import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "@ember/application";

var updateCookie = (container, api) => {
  const currentUser = api.getCurrentUser();
  const router = container.lookup("router:main");
  const route = router.currentRouteName.split('.')[0];
  const keepRecordFor = ['home', 'topic', 'discovery'];

  if(currentUser)  {
    $.removeCookie('neo4j_discourse_redirect');
  } else if (keepRecordFor.includes(route)) {
    $.cookie('neo4j_discourse_redirect', window.location.href, { expires: 1 });
  }
}

export default {
  name: 'neo4j-edits',
  initialize(container) {
    setDefaultHomepage('home');
    withPluginApi('0.8.31', (api) => {
      api.onPageChange(() => updateCookie(container, api));

      api.reopenWidget('search-term', {
        buildAttributes(attrs) {
          return {
            type: "text",
            value: attrs.value || "",
            autocomplete: "discourse",
            placeholder: I18n.t("neo4j.search-placeholder-text")
          };
        }
      });
    });
  }
}
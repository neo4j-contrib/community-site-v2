import { setDefaultHomepage } from "discourse/lib/utilities";
import { withPluginApi } from "discourse/lib/plugin-api";

var updateCookie = (api) => {
  const path = window.location.pathname;
  var location_cookie_value = ""
  if (!(/^\/u\//.test(path)) && !(/^\/admin\//.test(path))) {
    var location_cookie_value = window.location.href
    $.cookie('neo4j_discourse_redirect', location_cookie_value, { expires: 1 });
  }
  let currentUser = api.getCurrentUser();
  if(currentUser && location_cookie_value)  {
    $.removeCookie('neo4j_discourse_redirect');
  }
}

export default {
  name: 'neo4j-edits',
  initialize(container) {
    setDefaultHomepage('home');
    withPluginApi('0.8.31', (api) => {
      api.onPageChange(() => updateCookie(api));
    });
  }
}
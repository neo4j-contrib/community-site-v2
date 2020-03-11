import { createWidget } from 'discourse/widgets/widget';
import { formatLinkSet } from '../lib/style-link-sets';

export default createWidget('useful-links', {
  tagName: "div.useful-links",
  buildKey: () => 'useful-links',

  html() {
    var usefulLinks = Discourse.SiteSettings.neo4j_useful_links.split('|');

    return formatLinkSet (usefulLinks, "neo4j.widgets.useful-links.title");
  }
});

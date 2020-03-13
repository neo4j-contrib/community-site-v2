import { createWidget } from 'discourse/widgets/widget';
import { formatLinkSet } from '../lib/style-link-sets';

export default createWidget('neo4j-newbie-links', {
  tagName: "div.neo4j-newbie-links",
  buildKey: () => 'neo4j-newbie-links',

  html() {
    var neo4jNewbieLinks = Discourse.SiteSettings.neo4j_newbie_links.split('|');

    return formatLinkSet (neo4jNewbieLinks, "neo4j.widgets.neo4j-newbie-links.title");
  }
});

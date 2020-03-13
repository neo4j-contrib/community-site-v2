import { createWidget } from 'discourse/widgets/widget';
import { formatLinkSet } from '../lib/style-link-sets';

export default createWidget('graph-gear-store-links', {
  tagName: "div.graph-gear-store-links",
  buildKey: () => 'graph-gear-store-links',

  html() {
    var graphGearStoreLinks = Discourse.SiteSettings.neo4j_graph_gear_store_links.split('|');

    return formatLinkSet (graphGearStoreLinks, "neo4j.widgets.graph-gear-store-links.title");
  }
});

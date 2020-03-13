import { createWidget } from 'discourse/widgets/widget';
import { formatLinkSet } from '../lib/style-link-sets';

export default createWidget('jobs-links', {
  tagName: "div.jobs-links",
  buildKey: () => 'jobs-links',

  html() {
    var graphJobsLinks = Discourse.SiteSettings.neo4j_jobs_links.split('|');

    return formatLinkSet (graphJobsLinks, "neo4j.widgets.jobs-links.title");
  }
});

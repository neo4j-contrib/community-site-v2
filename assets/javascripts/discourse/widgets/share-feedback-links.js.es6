import { createWidget } from 'discourse/widgets/widget';
import { formatLinkSet } from '../lib/style-link-sets';

export default createWidget('share-feedback-links', {
  tagName: "div.share-feedback-links",
  buildKey: () => 'share-feedback-links',

  html() {
    var shareFeedbackLinks = Discourse.SiteSettings.neo4j_share_feedback_links.split('|');

    return formatLinkSet (shareFeedbackLinks, "neo4j.widgets.share-feedback-links.title");
  }
});

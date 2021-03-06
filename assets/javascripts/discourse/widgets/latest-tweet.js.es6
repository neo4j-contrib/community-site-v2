import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

export default createWidget('latest-tweet', {
  tagName: "div.latest-tweet.neo4j-widget-sidebar",
  buildKey: () => 'latest-tweet',

  html() {
    var nodes = [];

    nodes = [
      h("div.twitter-widget-container.neo4j-widget-main-container"),
      [
        h("a", {
          "attributes": {
            "class" : "twitter-timeline",
            "data-width" : Discourse.SiteSettings.neo4j_twitter_width,
            "data-height" : Discourse.SiteSettings.neo4j_twitter_height,
            "href": Discourse.SiteSettings.neo4j_twitter_handle_url,
            "rel": "noopener",
            "target": "_blank"
            }
          }, I18n.t('neo4j.widgets.tweets.title')
        ),
        h("script", {
          "charset" : "utf-8",
            "src": Discourse.SiteSettings.neo4j_twitter_script,
            "async": ""
          }
        )
      ]
    ]
    return h('div.twitter-widget-inner', [h('h3.neo4j-widget-sidebar-header', I18n.t('neo4j.widgets.tweets.title')), nodes]);
  }
})

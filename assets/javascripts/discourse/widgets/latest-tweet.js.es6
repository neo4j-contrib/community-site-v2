import { createWidget } from 'discourse/widgets/widget';
import ComponentConnector from 'discourse/widgets/component-connector';
import { h } from 'virtual-dom';

export default createWidget('latest-tweet', {
  tagName: "div.latest-tweet",
  buildKey: () => 'latest-tweet',

  defaultState(attrs) {
    return {
      topic: attrs.topic
    };
  },

  html(attrs, state) {
    const topic = state.topic;
    var nodes = [];
    if (!topic) {
      nodes = [
        h("div.twitter-widget-container"),
        [
          h("a", {
          "attributes": {
            "class" : "twitter-timeline",
            "data-width" : "220",
            "data-height" : "294",
            "href": "https://twitter.com/neo4j?ref_src=twsrc%5Etfw",
            "rel": "noopener",
            "target": "_blank"
          }}, 'Tweets by neo4j'),
          h("script", {
            "charset" : "utf-8",
              "src": "https://platform.twitter.com/widgets.js",
              "async": ""
            }
          )
        ]
      ]
    }
    return h('div.twitter-widget-inner', nodes);
  }
})

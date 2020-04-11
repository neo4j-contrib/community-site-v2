import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { getFeaturedMember } from '../lib/get-blog-posts';

export default createWidget('neo4j-loves-developers', {
  tagName: "div.neo4j-loves-developers",
  buildKey: () => 'neo4j-loves-developers',

  html() {

    var buffer = [];

    buffer = h("div.neo4j-loves-developers-container",
      h("div.neo4j-loves-developers-fixed-image",
        (h("a", {
          "attributes": {
            "href": Discourse.SiteSettings.neo4j_loves_developers_fixed_image_link,
            "rel": "noopener",
            "target":"_blank"
          }
          },
          h("img", {
            attributes: {
              "src" : Discourse.SiteSettings.neo4j_loves_developers_fixed_image_source
            }
          })
        ))
      )
    )

    return h('div.neo4j-loves-developers-inner.neo4j-widget-main', [h('div.neo4j-widget-main-header.neo4j-loves-developers-header', h('h3.neo4j-widget-main-title', I18n.t('neo4j.widgets.neo4j-loves-developers.title'))), buffer]);
  }
});

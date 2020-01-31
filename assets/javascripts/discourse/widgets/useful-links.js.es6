import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

export default createWidget('useful-links', {
  tagName: "div.useful-links",
  buildKey: () => 'useful-links',

  html() {

    var buffer = [];
    var usefulLinks = Discourse.SiteSettings.neo4j_useful_links.split('|');

    if (usefulLinks !== null) {
      if (usefulLinks.length > 0) {
        usefulLinks.forEach (usefulLink => {
          buffer.push(h("div.useful-links-entry",
              h("li",
                h("a", {
                  "attributes": {
                    "href": `${usefulLink.split(',')[1]}`,
                     "rel": "noopener", 
                     "target":"_blank" 
                  }
                },
                  h("span.useful-links-entry-title", `${usefulLink.split(',')[0]}`)    
                )
              )
          ))
        })
      }
    }
    return h('div.useful-links',
            [h('h3', I18n.t('neo4j.widgets.useful-links.title')),
              h('div.useful-links-list-container', buffer)
            ]
          );
  }
});

import { h } from 'virtual-dom';

let formatLinkSet = (linkSet, titleKey) => {
  var buffer = [];
  if (linkSet !== null) {
    if (linkSet.length > 0) {
      linkSet.forEach (link => {
        buffer.push(h("div.link-set-entry",
            h("li",
              h("a", {
                "attributes": {
                  "href": `${link.split(',')[1]}`,
                    "rel": "noopener",
                    "target":"_blank"
                }
              },
                h("span.link-set-entry-title", `${link.split(',')[0]}`)
              )
            )
        ))
      })
    }
  }
  return h('div.link-set.neo4j-widget-sidebar',
          [h('h3.neo4j-widget-sidebar-header', I18n.t(titleKey)),
            h('div.link-set-list-container', buffer)
          ]
        );
}

export { formatLinkSet } ;

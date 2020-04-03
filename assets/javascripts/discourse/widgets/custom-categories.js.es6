import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

export default createWidget('custom-categories', {
  tagName: "div.custom-categories",
  buildKey: () => 'custom-categories',

  html() {
    var categories_buffer = [];
    var subcategories_buffer = [];
    var subcategory_tabs = [];
    var selected_categories  = Discourse.SiteSettings.neo4j_category_nav_categories.split('|');

    var categories = this.site.get("categoriesByCount").filter(entry => selected_categories.includes(`${entry.id}`));
debugger;
    categories.sort((a, b) => {  
      return selected_categories.indexOf(`${a.id}`) - selected_categories.indexOf(`${b.id}`);
    });

    if (categories !== null) {
      if (categories.length > 0) {
        categories.forEach(category => {
          categories_buffer.push ([
              h("input", {
                "attributes": {
                  "type": "radio",
                  "name": "tabset",
                  "id": `tab${category.id}`,
                  "aria-controls": category.slug,
                  "checked": ""
                }
              }),
              h("label", {
                  "attributes" : {
                    "class": "underline",
                    "for": `tab${category.id}`
                  }
                }, category.name)
          ])
        });

        var subcategories_buffer = [];
        var subcategory_tabs = [];

        categories.forEach(category => {
          var subcategories = category.subcategories;
          var subcategories_buffer = [];
          subcategories.forEach(subcategory => {
            subcategories_buffer.push ([
              h("div.subcategory",
                h("a", {
                  "attributes": {
                  "href": `/c/${subcategory.id}`
                  }
                }, subcategory.name)
              )
            ]);
          });

          subcategories_buffer.push (
            h('div.subcategory',
              h('a', {
                "attributes": {
                  "href": `/c/${category.id}`
                }
              }, I18n.t('neo4j.widgets.announcements.link-text'))
            )
          );

          subcategory_tabs.push ([
            h("section", {
                "attributes" :{
                  "class": "tab-panel",
                  "id": category.slug
                }},
            h("div.subcategory-grid",subcategories_buffer))
          ]);
        })
      }
    };
    
    return h('div.custom-categories.neo4j-widget-main', [
            h('div.custom-categories-widget-header.neo4j-widget-main-header', [
            h('h3.custom-categories-widget-title.neo4j-widget-main-title', I18n.t('neo4j.widgets.custom-categories.title')),
              h('a.custom-categories-widget-main-link.neo4j-widget-main-main-link', {
                "attributes": {
                  "href": `/latest`
                }
              }, I18n.t('neo4j.widgets.custom-categories.link-text'))
            ]),
            h('div.tabset',
              [categories_buffer, h("div.tab-panels", subcategory_tabs)]
            )
           ]);
  }
});

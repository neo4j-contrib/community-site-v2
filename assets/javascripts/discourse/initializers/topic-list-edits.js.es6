import { withPluginApi } from 'discourse/lib/plugin-api';
import {  on } from 'ember-addons/ember-computed-decorators';
import { observes } from "discourse-common/utils/decorators";
import { renderAvatar } from "discourse/helpers/user-avatar";
import { empty, alias } from "@ember/object/computed";
import discourseComputed from "discourse-common/utils/decorators";
import { schedule } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { findRawTemplate } from "discourse/lib/raw-templates";
import hbs from 'discourse/widgets/hbs-compiler';

export default {
  name: 'topic-list-item-edits',
  initialize(container) {
    withPluginApi('0.8.33' , topicListItemEdits);  
  }
  
}
const topicListItemEdits = (api) => {
  api.modifyClass("component:topic-list-item", {
    routing:service("-routing"),
    poster: alias("topic.creator"), 
    lastPosterName: alias('topic.lastPoster.username'),
    @discourseComputed('poster')
    rendered(poster){
      return renderAvatar(poster, {imageSize: "extra_large"})
    },
    @discourseComputed('topic.last_posted_at')
    lastPostedAt(postedAt){
      return moment(postedAt).fromNow();
    },
    @observes("topic.pinned")
    renderTopicListItem() {
      if(!["discovery.category", "discovery.categoryWithID", "discovery.categoryNone"].includes(this.get("routing.currentRouteName"))) {
        this._super(...arguments);
      } else {
        const template = findRawTemplate("custom-topic-list-item");
        if (template) {
          this.set("topicListItemContents", template(this).htmlSafe());
        }
      }
    },
    replyCount: alias('topic.replyCount'),

    @on('didReceiveAttrs')
    showExcerpt() {
      if(["discovery.category", "discovery.categoryWithID", "discovery.categoryNone"].includes(this.get("routing.currentRouteName"))) {
        this.set('expandPinned', true);
      }

    },
    @on('didInsertElement')
    applyMods(){
      if(["discovery.category", "discovery.categoryWithID", "discovery.categoryNone"].includes(this.get("routing.currentRouteName"))) {
        this.$().addClass('neo-topic-list-item');
        this.$('.topic-excerpt').addClass('neo-topic-excerpt');

      }
    }
  });

  api.modifyClass('component:topic-list', {
    routing:service("-routing"),
    @on('didRender')
    applyCSS(){
      if(["discovery.category", "discovery.categoryWithID", "discovery.categoryNone"].includes(this.get("routing.currentRouteName"))) {
        schedule("afterRender", () => {
          this.$().addClass('neo-topic-list');
          this.$().css('border-collapse', 'separate');
          this.$().css('border-spacing', '0 1em');
          this.$('.posters').addClass('neo-posters');
          $('#navigation-bar').appendTo('.category-navigation');
          $('#navigation-bar').addClass('neo-nav-pills');
          $('#create-topic').prependTo('.neo-category-sidebar');
          $('#create-topic').addClass('neo-create-topic');
          $('#create-topic > .d-button-label').html(I18n.t('neo4j.neo-create-topic-text'));
          document.querySelector("body").classList.add("custom-sidebar", "sidebar-right");
          document.querySelector(".topic-list").classList.add("with-sidebar", 'right');
          

        });
      }
    }
  });

  api.modifyClass('component:navigation-bar', {
    routing: service('-routing'),
    
    @on('didReceiveAttrs')
    changeTemplate() {
      if(/[a-z]*(c|C)ategory/.test(this.routing.currentRouteName)) {
        const layout = api._lookupContainer('template:mobile/components/navigation-bar');
        this.set('layout', layout);
      }
    }

  });

  api.createWidget('neo-category-list', {
    tagName:"ul.neo-category-list",
    template: hbs`
        {{#each attrs as |category|}}
        <li class="neo-category-link">{{category-link category=category}}</li>
      {{/each}}
      {{!-- {{log attrs.categories}} --}}
      `,

  });

}

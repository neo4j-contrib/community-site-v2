import { withPluginApi } from 'discourse/lib/plugin-api';
import {  on } from 'ember-addons/ember-computed-decorators';
import { observes } from "discourse-common/utils/decorators";
import { renderAvatar } from "discourse/helpers/user-avatar";
import { empty, alias } from "@ember/object/computed";
import discourseComputed from "discourse-common/utils/decorators";
import { schedule } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { findRawTemplate } from "discourse/lib/raw-templates";

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
          // apply mods to be applied specifically category topic lists 
          this.$('.posts.sortable.num').hide();
          this.$('.views.sortable.num').hide();
          this.$('.activity.sortable.num').hide();
          this.$('td.posters').css('vertical-align', 'bottom');
          this.$('td.posters>a').css('margin-left', '-20px');
          this.$().css('border-collapse', 'separate');
          this.$().css('border-spacing', '0 1em');
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

}

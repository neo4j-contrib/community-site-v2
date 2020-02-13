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
    @discourseComputed('poster')
    rendered(poster){
      return renderAvatar(poster, {imageSize: "extra_large"})
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

    @on('didInsertElement')
    check(){
      // console.log(this.get('topic.replyCount'));
      // debugger;
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
          this.$('img.avatar').css('margin-left', '-20px');
          
        });
      }
    }
  });
}

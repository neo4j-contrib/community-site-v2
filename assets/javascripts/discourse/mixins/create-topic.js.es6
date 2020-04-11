export default Ember.Mixin.create({

    _createTopic(category_id) {
      const container = Discourse.__container__;
      const controller = container.lookup("controller:navigation/category");
      const composerController = container.lookup("controller:composer");

      if (!Discourse.currentUser) {
        DiscourseURL.routeTo('/login');
        return;
      }

      composerController.open({
        action: Composer.CREATE_TOPIC,
        draftKey: Composer.DRAFT,
        categoryId: category_id
      });
    }
})
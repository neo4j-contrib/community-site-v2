import Category from "discourse/models/category";
import { getOwner } from "@ember/application";

export default {
  setupComponent(attrs, component) {
    const currentRouteName = getOwner(this).lookup('router:main').get('currentRoute.name');
    component.set('display', false);
    if(/discovery.[a-zA-Z]*(c|C)ategory[a-zA-Z]*/.test(currentRouteName)) {
      component.set('display', true);
      component.set('categories', Category.list());
    }

  }
}

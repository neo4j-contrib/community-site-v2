import Category from "discourse/models/category";
export default {
  setupComponent(attrs, component) {
    console.log(Category.list());
    component.set('categories', Category.list());
  }
}

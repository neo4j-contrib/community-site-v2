import { setDefaultHomepage } from "discourse/lib/utilities";

export default {
  name: 'neo4j-edits',
  initialize(container) {
    setDefaultHomepage('home');
  }
}
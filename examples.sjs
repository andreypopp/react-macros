import macros from "sweet-jsx"
import macros from "./index.sjs"

var React = 11;

component Button {
  mixin SomeMixin

  prop caption required string
  prop active bool
  prop onClick func

  render() {
    return React.DOM.div({onClick: this.onClick}, >caption);
  }
}

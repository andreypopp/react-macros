# react-macros

A set of syntax extensions for [React][react]:

  * `component Name { ... }` for component definition
  * `mixin Mixin` directive
  * `prop name type` for prop definition
  * `>propName` and `@stateKey` accessors for component properties and state

Example:
    
    component Button {

      mixin SomeMixin

      prop caption required string
      prop active bool
      prop onClick func

      render() {
        return React.DOM.div({onClick: this.onClick}, >caption);
      }
    }

[react]: http://facebook.github.io/react/

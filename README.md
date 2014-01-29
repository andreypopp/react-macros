# react-macros

A set of syntax extensions for [React][react]:

  * `component Name { ... }` for component definition
  * `mixin Mixin` directive
  * `prop name type` for prop definition
  * `>propName` and `@stateKey` accessors inside methods

Example:
    
    component Button {

      mixin SomeMixin

      prop caption string
      prop active bool
      prop onClick func

      render() {
        return React.DOM.div({onClick: this.onClick}, >caption);
      }
    }

[react]: http://facebook.github.io/react/

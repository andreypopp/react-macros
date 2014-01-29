macro __expandAccessors {
  case { _ $tokens ... } => {

    function expand(tokens, func) {
      var result = [];

      for (var i = 0, len = tokens.length; i < len; i++) {
        var tok = tokens[i];
        var news = func(tok, tokens[i + 1]);

        if (news) {
          result = result.concat(news);
        } else if (tok.token.inner) {
          tok.token.inner = expand(tok.token.inner, func);
          result.push(tok);
        } else {
          result.push(tok);
        }
      }

      return result;
    }

    return expand(#{$tokens ...}, function(tok, ntok) {
      if (ntok &&
          ntok.token.type === parser.Token.Identifier &&
          // guarantee tokens have no spaces between
          ntok.token.range[0] == tok.token.range[1]) {
        if (tok.token.type === parser.Token.Punctuator && tok.token.value === '@') {
          return #{this.state.}
        }
        if (tok.token.type === parser.Token.Punctuator && tok.token.value === '>') {
          return #{this.props.}
        }
      }
    });
  }
}

macro __componentBody {

  rule { $React:ident $spec:ident { } } => {}

  // methods
  rule { $React:ident $spec:ident { $($mname($args ...) { $mbody ... }) $body ... } } => {
    $spec.$mname = function($args ...) { __expandAccessors $mbody ... };
    __componentBody $React $spec { $body ... }
  }

  // prop definition
  rule { $React:ident $spec:ident { $(prop $name:ident required $typ:expr) $body ... } } => {
    $spec.propTypes.$name = $React.PropTypes.$typ.isRequired;
    __componentBody $React $spec { $body ... }
  }
  rule { $React:ident $spec:ident { $(prop $name:ident $typ:expr) $body ... } } => {
    $spec.propTypes.$name = $React.PropTypes.$typ;
    __componentBody $React $spec { $body ... }
  }

  // mixin definitions
  rule { $React:ident $spec:ident { $(mixin $($mixin:expr (,) ...)) $body ... } } => {
    $spec.mixins = $spec.mixins.concat($mixin (,) ...);
    __componentBody $React $spec { $body ... }
  }
}

macro component {

  case { _ $name:ident { $body ... } } => {
    letstx $displayName = [makeValue(#{$name}[0].token.value, #{here})];
    letstx $React = [makeIdent('React', #{$name})];
    return #{
      var $name = (function() {
        var spec = {displayName: $displayName, propTypes: {}, mixins: []};
        __componentBody $React spec { $body ... }
        return $React.createClass(spec);
      })();
    }
  }
}

export component;

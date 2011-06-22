Backbone.MeningesModel = Backbone.Model.extend({
  constructor: function() {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    if (this.associations) {
      var self = this;
      _(_(this.associations).keys()).each(function (key) {
        var obj = self.lookupConstructor(self.associations[key].model);
        if (obj !== undefined) {
          var setter = {};
          setter[key] = new obj(self.attributes[key]);
          self.set(setter);
        }
      });
    }
  },

  toJSON: function () {
    var o = Backbone.Model.prototype.toJSON.apply(this, arguments);
    var self = this;
    if (this.associations) {
      _(_(this.associations).keys()).each(function (key) {
        var obj = self.lookupConstructor(self.associations[key].model);
        if (obj !== undefined) {
          o[key] = o[key].toJSON();
        }
      });
    }
    return o;
  },

  parse: function(attributes, xhr) {
    var attrs = Backbone.Model.prototype.parse.apply(this, arguments);
    if (this.associations) {
      var self = this;
      _(_(this.associations).keys()).each(function (key) {
        var obj = self.lookupConstructor(self.associations[key].model);
        if (obj !== undefined) {
          var setter = {};
          setter[key] = new obj(attributes[key]);
          self.set(setter);
          delete attrs[key];
        }
      });
    }
    return attrs;
  },

  lookupConstructor: function (classPath) {
    var obj = window;
    _(classPath.split(".")).each(function(pathElement) {
      obj = obj[pathElement];
    });
    return obj;
  }
});

Backbone.FormView = {
  extend: function (o) {

    o.events = o.events || {};
    o.events["blur input"] = 'updateModel';

    o.updateModel = function (event) {

      var pathItems = event.target.name.split(".");
      var currentModel = this.model;

      for (var i = 0; i < pathItems.length - 1; i++) {
        currentModel = currentModel.get(pathItems[i]);
      }
      var newValueHash = {};
      newValueHash[_(pathItems).last()] = event.target.value;
      currentModel.set(newValueHash);
    };

    return Backbone.View.extend(o);
  }
};

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
Backbone.FormView = {
  extend: function (o) {

    var findNextModel = function (startingModel, pathElement) {
      if (pathElement.indexOf(":") === -1) {
          return startingModel.get(pathElement);
        }
        else {
          var a = pathElement.split(":");
          return startingModel.get(a[0]).at(parseInt(a[1]));
        }
    };

    var extractValue = function (event) {
      if(event.target.type === "checkbox") {
        return event.target.checked;
      }
      return event.target.value;
    };

    o.events = o.events || {};
    o.events["blur .meninges"] = 'refreshModel';

    o.refreshModel = function (event) {
      var pathItems = event.target.name.split(".");
      var currentModel = this.model;

      for (var i = 0; i < pathItems.length - 1; i++) {
        currentModel = findNextModel(currentModel, pathItems[i]);
      }
      var newValueHash = {};
      newValueHash[_(pathItems).last()] = extractValue(event);
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

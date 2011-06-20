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
    if (Backbone.MODELS_NS) {
      var self = this;
      _(_(this.attributes).keys()).each(function (key) {
        var modelClass = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();
        if (Backbone.MODELS_NS[modelClass] !== undefined) {
          var setter = {};
          setter[key] = new Backbone.MODELS_NS[modelClass](self.attributes[key]);
          self.set(setter);
        }
      });
    }
  },

  toJSON: function () {
    var o = Backbone.Model.prototype.toJSON.apply(this, arguments);
    if (Backbone.MODELS_NS) {
      _(_(o).keys()).each(function (key) {
        var modelClass = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();
        if (Backbone.MODELS_NS[modelClass] !== undefined) {
          o[key] = o[key].toJSON();
        }
      });
    }
    return o;
  }
});

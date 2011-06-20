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
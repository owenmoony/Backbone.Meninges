Backbone.MeningesView = {
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
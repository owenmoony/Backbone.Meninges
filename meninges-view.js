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

    var extractValue = function (element) {
      if(element.type === "checkbox") {
        return element.checked;
      }
      return element.value || '';
    };

    o.events = o.events || {};
    o.events["blur .meninges"] = 'updateAttributeForEvent';
    o.events["change input.meninges[type='checkbox']"] = 'updateAttributeForEvent';
    o.events["change select.meninges"] = 'updateAttributeForEvent';

    o.updateAttribute = function(pathItems, value, currentModel){
      for (var i = 0; i < pathItems.length - 1; i++) {
        currentModel = findNextModel(currentModel, pathItems[i]);
      }
      var newValueHash = {};
      newValueHash[_(pathItems).last()] = value;
      currentModel.set(newValueHash);
    }

    o.updateAttributeForEvent = function (event) {
      var pathItems = event.target.name.split(".");
      var value = extractValue(event.target);
      o.updateAttribute(pathItems, value, this.model)
    };

    o.updateModelFromForm = function (){
      var that = this;
      _.each($('.meninges'), function (control) {
        var pathItems = control.name.split(".");
        var value = extractValue(control);
        o.updateAttribute(pathItems, value, that.model)
      });
    };

    return Backbone.View.extend(o);

  }
};

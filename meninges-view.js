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
      if (element.type === "checkbox") {
        return element.checked;
      }
      return element.value || '';
    };

    o.events = o.events || {};
    o.events["blur .meninges"] = 'updateAttributeForEvent';
    o.events["change input.meninges[type='checkbox']"] = 'updateAttributeForEvent';
    o.events["change input.meninges[type='radio']"] = 'updateAttributeForEvent';
    o.events["change select.meninges"] = 'updateAttributeForEvent';

    o.updateAttribute = function(pathItems, value) {
      var currentModel = this.model;
      var originalModel = this._originalModel;
      for (var i = 0; i < pathItems.length - 1; i++) {
        currentModel = findNextModel(currentModel, pathItems[i]);
        originalModel = findNextModel(originalModel, pathItems[i]);
      }

      var newValueHash = {};
      var oldValue = currentModel.get(_(pathItems).last());
      var originalValue = originalModel.get(_(pathItems).last());
      if (_(originalValue).isNumber()) {
        value = parseFloat(value) || null;
      }
      if (value === '' && originalValue === null) {
        value = null;
      }

      var sameValue = (oldValue === value);
      newValueHash[_(pathItems).last()] = value;
      if (!sameValue) {
        currentModel.set(newValueHash);
      }
    };

    o.updateAttributeForEvent = function (event) {
      var pathItems = event.target.name.split(".");
      var value = extractValue(event.target);
      o.updateAttribute.call(this, pathItems, value)
    };

    var render = o.render;
    o.render = function () {
      render.call(this);
      this._originalModel = this.model.clone();
      return this;
    }
    return Backbone.View.extend(o);
  }
};

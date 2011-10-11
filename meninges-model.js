Backbone.MeningesModel = Backbone.Model.extend({
  constructor: function() {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.replaceWithMeningesAttributes(this.attributes);
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

  parse: function(attrs, xhr) {
    this.replaceWithMeningesAttributes(attrs);
    return attrs;
  },

  replaceWithMeningesAttributes: function(attrs) {
    if (this.associations) {
      var self = this;
      _(_(this.associations).keys()).each(function (key) {
        var obj = self.lookupConstructor(self.associations[key].model);
        if (obj !== undefined) {
          if(self.get(key) && self.get(key).set) {
            self.get(key).set(self.get(key).parse(attrs[key]));
            delete attrs[key];
          }
          else if(self.get(key) && self.get(key).reset) {
            self.populateCollectionFromArray(attrs[key], self.get(key));
            delete attrs[key];
          }
          else {
            attrs[key] = new obj(attrs[key]);
          }
        }
      });
    }
  },

  populateCollectionFromArray: function (els, collection) {
    collection.each(function (model) {
      _(els).each(function (el, index) {
        if(model.equals && model.equals(el)) {
          model.set(model.parse(el));
          delete els[index];
        }
      });
    });
    _(els).each(function (el) {
      collection.add(new collection.model(el));
    });
  },

  lookupConstructor: function (classPath) {
    var obj = window;
    _(classPath.split(".")).each(function(pathElement) {
      obj = obj[pathElement];
    });
    return obj;
  }
});

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
        if (obj !== undefined && o[key]) {
          o[key] = o[key].toJSON();
        }
      });
    }
    return o;
  },


  parse: function (attrs, xhr, isNested) {
    var attrsClone = _(attrs).clone();
    this.replaceWithMeningesAttributes(attrs);
    if (isNested) {
      this.removeAttributesNotProvided(attrsClone);
    }
    return attrs;
  },

  removeAttributesNotProvided: function (attrs) {
    var keys = _(this.attributes).keys();
    var self = this;
    _(keys).each(function (key) {
      if (!attrs[key]) {
        self.unset(key);
      }
    });
  },

  clone: function() {
    return new this.constructor(this.toJSON());
  },

  replaceWithMeningesAttributes: function (attrs) {
    if (this.associations) {
      var self = this;
      _(_(this.associations).keys()).each(function (key) {
        var obj = self.lookupConstructor(self.associations[key].model);
        if (obj !== undefined) {
          if (self.get(key) && self.get(key).set) {
            self.get(key).set(self.get(key).parse(attrs[key], null, true));
            delete attrs[key];
          }
          else if (self.isKeyAnUpdatableCollection(self, key, attrs)) {
            self.populateCollectionFromArray(attrs[key], self.get(key));
            delete attrs[key];
          }
          else if (attrs && attrs[key]) {
            attrs[key] = new obj(attrs[key]);
          }
        }
      });
    }
  },

  isKeyAnUpdatableCollection: function (model, key, attrs) {
    return model.get(key) && model.get(key).reset && attrs && attrs[key]
  },

  populateCollectionFromArray: function (els, collection) {
    var modelsToRemove = [];
    var indexesToRemove = [];
    collection.each(function (model) {
      var matched = false;
      _(els).each(function (el, index) {
        if (model.equals && model.equals(el)) {
          model.set(model.parse(el, null, true));
          matched = true;
          indexesToRemove.push(index);
        }
      });
      if (!matched) {
        modelsToRemove.push(model);
      }
    });

    _(modelsToRemove).each(function (model) {
      collection.remove(model);
    });
    _(indexesToRemove).each(function (index) {
      delete els[index];
    });

    _(els).each(function (el) {
      if (el) {
        collection.add(new collection.model(el));
      }
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

describe("meninges", function () {

  var data = function () {
    // nested model (configuration) with collection (roles) 
    // of models with collections (authorizations) of models
    return {
      id: 1,
      configuration: {
        roles: [
          {
            name: "this and that",
            authorizations: [
              {
                name: "do this",
                value: "yes"
              },
              {
                name: "do that", 
                value: "no"
              }
            ]
          }, 
          {
            name: "here and there", 
            authorizations: [
              {
                name: "come here", 
                value: "yes"
              }, 
              {
                name: "go there", 
                value: "no"
              }
            ]
          }
        ]
      } 
    };
  };
  
  window.SomeApp = {};

  SomeApp.Authorization = Backbone.Model.extend({
    equals: function (json) {
      try {
        return this.get("name") == json.name;
      } catch (e) {
        return false;
      }
    }
  });
  
  SomeApp.Authorizations = Backbone.Collection.extend({
    model: SomeApp.Authorization
  });
  
  SomeApp.Role = Backbone.MeningesModel.extend({
    associations: {
      "authorizations": {model: "SomeApp.Authorizations"} 
    },

    equals: function (json) {
      try { 
        return this.get("name") == json.name;
      } catch(e) {
        return false;
      }
    }
  });

  SomeApp.Roles = Backbone.Collection.extend({
    model: SomeApp.Role
  });

  SomeApp.Configuration = Backbone.MeningesModel.extend({
    associations: {
      "roles": {model: "SomeApp.Roles"}
    }
  });

  SomeApp.TopLevel = Backbone.MeningesModel.extend({
    associations: {
      "configuration": {model: "SomeApp.Configuration"},
    }
  });


  var testDeepNesting = function (topLevel) {
    it("should load nested models", function () {
      expect(topLevel.get("configuration").get).toBeDefined();
    });
    
    it("should load nested collections", function () {
      expect(topLevel.get("configuration").get("roles").at).toBeDefined();
      console.log(topLevel.get("configuration"));
    });
    
    it("should load model in the nested collections", function () {
      expect(topLevel.get("configuration").get("roles").at(0).get).toBeDefined();
    });

    it("should load collections under models in nested collections", function () {
      expect(topLevel.get("configuration").get("roles").at(0).get("authorizations").at).toBeDefined();
    });

    it("should load models in collections under models in nested collections", function () {
      expect(topLevel.get("configuration").get("roles").at(0).get("authorizations").at(0).get).toBeDefined();
    });
  };
  
  describe("constructor", function () {
    testDeepNesting(new SomeApp.TopLevel(data()));
  });

  describe("fetch and save, via set and parse", function () {
    
    var topLevel = new SomeApp.TopLevel();
    topLevel.set(topLevel.parse(data()));
    testDeepNesting(topLevel);
  });

  describe("re-using existing nested objects when parsing is called", function () {

    var topLevel;
    var configuration;
    var roles;
    var firstRole;
    var authorizations;
    var firstAuthorization;

    beforeEach(function () {
      topLevel = new SomeApp.TopLevel(data());
      configuration = topLevel.get("configuration");
      roles = configuration.get("roles");
      firstRole = roles.at(0);
      authorizations = firstRole.get("authorizations");
      firstAuthorization = authorizations.at(0);
    });
      
    it("should re-use the existing nested models when set is called", function () {
      topLevel.set(topLevel.parse(data()));
      expect(configuration).toEqual(topLevel.get("configuration"));
      expect(roles).toEqual(topLevel.get("configuration").get("roles"));
      expect(firstRole).toEqual(topLevel.get("configuration").get("roles").at(0));
      expect(firstAuthorization).toEqual(topLevel.get("configuration").get("roles").at(0).get("authorizations").at(0));
    });

    it("should re-use the same objects but update their attributes", function () {
      var newData = data();
      newData.configuration.roles[0].authorizations[0].value = "no";

      topLevel.set(topLevel.parse(newData));
      expect(firstAuthorization).toEqual(topLevel.get("configuration").get("roles").at(0).get("authorizations").at(0));
      expect(topLevel.get("configuration").get("roles").at(0).get("authorizations").at(0).get("value")).toEqual("no");
    });

    xit("should remove the nested models that match no incoming attribute", function () {
      var newData = data();
      delete newData.configuration.roles[0].authorizations[0];
      topLevel.set(topLevel.parse(newData));
      expect(topLevel.get("configuration").get("roles").at(0).get("authorizations").length).toEqual(1);
    });
  });
});

describe("meninges", function () {

  var data = function () {
    return {
      id: 1,
      title: "Le Menon",
      author: {
        is_dead: true,
        name: "Platon",
        gender: "male",
        country: {
          name: "greece",
          continent: "europe"
        },
        links: [
          {type: "biographie", uri: "http://laviedeplaton.fr"}
        ]
      },
      links: [
        {type: "buy", uri: "http://amazon.fr/123"},
        {type: "read", uri: "http://livresenligne.fr/lemenon"}
      ]
    };
  };
  
  window.Meninges = {};
  Backbone.MODELS_NS = Meninges;
  Meninges.Country = Backbone.Model.extend();
  Meninges.Author = Backbone.MeningesModel.extend({
    associations: {
      "country" : {model: "Meninges.Country"}, 
      "links" : {model: "Meninges.Links"}
    }
  });
  
  Meninges.Links = Backbone.Collection.extend({
    model: Meninges.Link,
    proveImALinksCollection: function () {
    }
  });
  
  Meninges.Link = Backbone.Model.extend();
  
  Meninges.Book = Backbone.MeningesModel.extend({
    associations: {
      "author": {model: "Meninges.Author"},
      "links": {model: "Meninges.Links"}
    }
  });

  describe("constructor", function () {
    
    var book;
    
    beforeEach(function () {
      book = new Meninges.Book(data());
    });
    
    it("should load the author as a nested model", function () {
      expect(book.get("author").get).toBeDefined();
    });
    
    it("should load country as a nested model of author", function () {
      expect(book.get("author").get("country").get).toBeDefined();
    });
    
    it("should load links as a nested collection of author", function () {
      expect(book.get("author").get("links").reset).toBeDefined();
    });

    it("should load the links in a Meninges.Links collection", function () {
      expect(book.get("links").reset).toBeDefined();
    });
  });

  describe("parse", function () {
    
    var book;
    
    beforeEach(function () {
      book = new Meninges.Book();
      book.parse(data());
    });

    it("should load the author as a nested model", function () {
      expect(book.get("author").get).toBeDefined();
    });

    it("should load country as a nested model of author", function () {
      expect(book.get("author").get("country").get).toBeDefined();
    });

    it("should load the links in a Meninges.Links collection", function () {
      expect(book.get("links").proveImALinksCollection).toBeDefined();
    });
    
    xit("should re-use the existing nested models when set is called", function () {
      book = new Meninges.Book(data());
      var bookLinks = book.get("links");
      var authorLinks = book.get("author").get("links");
      var newData = data();
      newData.author.links[0].uri = "http://what?"
      book.set(book.parse());
      expect(bookLinks).toEqual(book.get("links"));
      expect(authorLinks).toEqual(book.get("author").get("links"));
      expect(book.get("author").get("links").at(0).get("uri")).toEqual("http://what?");
    });
  });
});

describe("meninges", function () {
  beforeEach(function () {
    window.Meninges = {};
    Backbone.MODELS_NS = Meninges;
    Meninges.Country = Backbone.MeningesModel.extend();
    Meninges.Author = Backbone.MeningesModel.extend();
    Meninges.Links = Backbone.Collection.extend({
      model: Meninges.Link,
      proveImALinksCollection: function () {} 
    });
    Meninges.Link = Backbone.MeningesModel.extend();
    Meninges.Book = Backbone.MeningesModel.extend();

    Meninges.BookView = Backbone.FormView.extend({

      events: {
        "click input[name='author.name']": "externalEventHandlerExample"
      },

      externalEventHandlerExample: function () {
        console.log("running the external event handler");
      },

      render: function () {
        var html = '<input name="title" type="text" />' +
            '<input name="author.name" type="text" />' +
            '<input name="author.country.name" type="text">"';
        $(this.el).html(html);
        $("#book-form-container").html(this.el);
      }
    });

    this.data = {
      id: 1,
      title: "Le Menon",
      author: {
        name: "Platon",
        gender: "male",
        country: {
          name: "greece",
          continent: "europe"
        }
      },
      links: [
        {type: "buy", uri: "http://amazon.fr/123"},
        {type: "read", uri: "http://livresenligne.fr/lemenon"}
      ]
    };

    this.book = new Meninges.Book(this.data);
    this.bookView = new Meninges.BookView({model: this.book});
    this.bookView.render();
  });

  it("should load the author as a nested model", function () {
    expect(this.book.get("author").get).toBeDefined();
  });

  it("should load country as a nested model of author", function () {
    expect(this.book.get("author").get("country").get).toBeDefined();
  });

  it("should load the links in a Meninges.Links collection", function () {
    expect(this.book.get("links").proveImALinksCollection).toBeDefined();
  });

  describe("html form/relational model synchronisation", function () {
    it("should update the model when the user is changing the form values", function () {

      $("input[name='title']").val("a").trigger("blur");
      expect(this.book.get("title")).toEqual("a");

      $("input[name='author.name']").val("b").trigger("blur");
      expect(this.book.get("author").get("name")).toEqual("b");

      $("input[name='author.country.name']").val("c").trigger("blur");
      expect(this.book.get("author").get("country").get("name")).toEqual("c");

    });

    it("should be updated in the json output as well", function () {

      $("input[name='title']").val("new title").trigger("blur");
      expect(this.book.toJSON().title).toEqual("new title");

      $("input[name='author.name']").val("new name").trigger("blur");
      expect(this.book.toJSON().author.name).toEqual("new name");

      $("input[name='author.country.name']").val("turkey").trigger("blur");
      expect(this.book.toJSON().author.country.name).toEqual("turkey");

    });
  });

});
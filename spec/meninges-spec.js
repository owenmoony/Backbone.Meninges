describe("meninges", function () {

  var data;

  beforeEach(function () {
    window.Meninges = {};
    Backbone.MODELS_NS = Meninges;
    Meninges.Country = Backbone.Model.extend();
    Meninges.Author = Backbone.MeningesModel.extend({
      associations: {
        "country" : {model: "Meninges.Country"}
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

    Meninges.BookView = Backbone.MeningesView.extend({

      events: {
        "click input[name='author.name']": "externalEventHandlerExample"
      },

      externalEventHandlerExample: function () {
        //console.log("running the external event handler");
      },

      render: function () {
        var html = '<input name="title" class="meninges" type="text" />' +
            '<input name="author.name" class="meninges" type="text" />' +
            '<input name="author.country.name" class="meninges" type="text">"' +
            '<select name="author.country.continent" class="meninges">' +
            '<option value="europe">europe</option><option value="afrique">afrique</option></select>' +
            '<input name="links:0.type" class="meninges" type="text" />' +
            '<input name="author.is_dead" class="meninges" type="checkbox" />';
        $(this.el).html(html);
        $("#book-form-container").html(this.el);
      }
    });

    data = {
      id: 1,
      title: "Le Menon",
      author: {
        is_dead: true,
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

    this.book = new Meninges.Book(data);
    this.bookView = new Meninges.BookView({model: this.book});
    this.bookView.render();
  });

  describe("constructor", function () {
    it("should load the author as a nested model", function () {
      expect(this.book.get("author").get).toBeDefined();
    });

    it("should load country as a nested model of author", function () {
      expect(this.book.get("author").get("country").get).toBeDefined();
    });

    it("should load the links in a Meninges.Links collection", function () {
      expect(this.book.get("links").proveImALinksCollection).toBeDefined();
    });
  });

  describe("parse", function () {
    beforeEach(function () {
      this.book = new Meninges.Book();
      this.book.parse(data);
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
  });


  describe("html form/relational model synchronisation", function () {
    it("should update the model when the user is changing the form values", function () {

      $("input[name='title']").val("a").trigger("blur");
      expect(this.book.get("title")).toEqual("a");

      $("input[name='author.name']").val("b").trigger("blur");
      expect(this.book.get("author").get("name")).toEqual("b");

      $("input[name='author.country.name']").val("c").trigger("blur");
      expect(this.book.get("author").get("country").get("name")).toEqual("c");

      $("select[name='author.country.continent']").val("afrique").trigger("blur");
      expect(this.book.get("author").get("country").get("continent")).toEqual("afrique");

    });

    describe("collections (list of text inputs)", function () {
      it("should synchronise collections as well as models", function () {
        $("input[name='links:0.type']").val("what?").trigger("blur");
        expect(this.book.get("links").at(0).get("type")).toEqual("what?");
      });
    });

    describe("boolean values (checkboxes)", function () {
      it("should set true on the model when the checkbox is ticked (and false when un-ticked", function () {
        $("input[name='author.is_dead']").prop("checked", false).trigger("blur");
        expect(this.book.get("author").get("is_dead")).toEqual(false);
      });
    });

    it("should be updated in the json output as well", function () {

      $("input[name='title']").val("new title").trigger("blur");
      expect(this.book.toJSON().title).toEqual("new title");

      $("input[name='author.name']").val("new name").trigger("blur");
      expect(this.book.toJSON().author.name).toEqual("new name");

      $("input[name='author.country.name']").val("turkey").trigger("blur");
      expect(this.book.toJSON().author.country.name).toEqual("turkey");

      $("select[name='author.country.continent']").val("afrique").trigger("blur");
      expect(this.book.toJSON().author.country.continent).toEqual("afrique");

      $("input[name='links:0.type']").val("sonic").trigger("blur");
        expect(this.book.toJSON().links[0].type).toEqual("sonic");

    });
  });

});
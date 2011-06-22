# Meninges - Deep Models and Smart forms for Backbone js

Meninges models let you load deep domain models into backbone models by declaring associations (rather than coding the relationships manually).
It also provides a FormView that binds blur events on html form inputs to a function refreshing the backing MeningesModel from the form values.

# To use it

* Include meninges.js in your page:

```javascript
    <script type="text/javascript" src="js/meninges.js"></script>
```

* Define your Models

```javascript
    Meninges.Country = Backbone.Model.extend();
    Meninges.Author = Backbone.MeningesModel.extend({
      associations: {
        "country" : {model: "Meninges.Country"}
      }
    });
    Meninges.Links = Backbone.Collection.extend({
      model: Meninges.Link
    });
    Meninges.Link = Backbone.Model.extend();
    Meninges.Book = Backbone.MeningesModel.extend({
      associations: {
        "author": {model: "Meninges.Author"},
        "links": {model: "Meninges.Links"}
      }
    });
```

* Load your json into your models

```javascript
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

    var book = new Meninges.Book(data);
```

* Nested objects are automatically loaded into MeningesModel (as long as they're defined)

```javascript
    book.get("author").get("country").get("name") //greece
```

# Put a form in front of your model
* Extend Backbone.FormView

```javascript
    Meninges.BookView = Backbone.FormView.extend({
      render: function () {
        var html = '<select name="author.country.continent" class="meninges">';
        $(this.el).html(html);
        return this;
      }
    });
```

* Instantiate it

```javascript
    bookView = new Meninges.BookView({model: this.book});
    // ... render the view and append to a html node.
```

* From then on, user input should be synchronised to MeningesModel as the user leaves the input fields (blur).

* Link input fields to model attributes

```javascript
    <input name="author.country.name" class="meninges" type="text" />
    // links to this.model.get("author").get("country").get("name")

    <input name="links:0.url" class="meninges" type="text" />
    // links to this.model.get("links").at(0).get("url")
```
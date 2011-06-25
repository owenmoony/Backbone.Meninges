Meninges models let you load deep domain models into backbone models by declaring associations (rather than coding the relationships manually).
Meninges also provides a FormView that binds blur events on html form inputs to a function refreshing the backing MeningesModel from the form values.

# To use it

* Include meninges.js in your page:

```javascript
    <script type="text/javascript" src="js/meninges-model.js"></script>
    <script type="text/javascript" src="js/meninges-view.js"></script>
```

* Define your Models

```javascript
    MyApp.Country = Backbone.Model.extend();
    MyApp.Author = Backbone.MeningesModel.extend({
      associations: {
        "country" : {model: "MyApp.Country"}
      }
    });
    MyApp.Links = Backbone.Collection.extend({
      model: MyApp.Link
    });
    MyApp.Link = Backbone.Model.extend();
    MyApp.Book = Backbone.MeningesModel.extend({
      associations: {
        "author": {model: "MyApp.Author"},
        "links": {model: "MyApp.Links"}
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

    var book = new MyApp.Book(data);
```

* Nested objects are automatically loaded into MeningesModel (as long as they're defined)

```javascript
    book.get("author").get("country").get("name") //greece
```

* toJSON will include the json of the nested meninges models

# Put a form in front of your model
* Extend Backbone.MeningesView

```javascript
    MyApp.BookView = Backbone.MeningesView.extend({
      render: function () {
        var html = '<select name="author.country.continent" class="meninges">';
        $(this.el).html(html);
        return this;
      }
    });
```

* Instantiate it

```javascript
    bookView = new MyApp.BookView({model: this.book});
    // ... render the view and append to a html node.
```

* From then on, user input should be synchronised to MeningesModel as the user leaves the input fields (blur).

* Follow this syntax to bind input fields to model attributes

```javascript
    <input name="author.country.name" class="meninges" type="text" />
    // binds the input to this.model.get("author").get("country").get("name")

    <input name="links:0.url" class="meninges" type="text" />
    // binds the input to this.model.get("links").at(0).get("url")
```
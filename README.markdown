# Meninges - Deep Models and Smart forms for Backbone js

Meninges models let you load deep domain models into backbone models by declaring associations (rather than coding the relationships manually).
It also provides a FormView that binds blur events on inputs to a function refreshing the backing MeningesModel from the form values.

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

* Nested objects are automatically loaded into MeningesModel (if defined)

```javascript
    book.get("author").get("country").get("name") //greece
```
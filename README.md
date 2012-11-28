## Anvil EJS Plugin

This plugin allows you to build static html files from ejs templates.

Anvil.ejs requires [anvil.js](https://github.com/appendto/anvil.js) version 0.8.* or greater and [EJS](https://github.com/janl/ejs.js) 0.8.3 or greater.

## Installation

anvil install anvil.ejs

## Usage

If this plugin is installed and enabled, by default all .html and .ejs files will run ejs to compile from the  data in the build.json file.

### Passing data into the templates

All of the ejs templates will have the data from the anvil build.json file passed into them.  For example:

```javascript
{
	"anvil.ejs": {
		"data": {
			"hello": "Hello World!"
		}
	}
}
```

when paired with a template like this:

```html
<div class="my-div"><%= hello %></div>
```

would render this after an anvil build:

```html
<div class="my-div">Hello World</div>
```

### Rendering Partials

The only non-standard EJS function that this plugin currently extends is for rendering partials. The markup is based off of the [Express](http://expressjs.com/) implementation of EJS templates.  The first argument should be the path to the partial template. There is no need to include the file extension because Anvil.EJS will loop over the supported formats and find the template for you. The second argument can be any parameters you want to pass into the template. The partials will also inherit any data from the build.js file.

With a partials/header.html file like this:

```html
<h1><%= title %></h1>
```

and an index.html file like this:

```html
<%- partial("partials/header", { title: "My Awesome Header" }) %>
<h2>This is the index.html page!</h2>
```

The index.html page would be built to look like this:

```html
<h1>My Awesome Header</h1>
<h2>This is the index.html page!</h2>
```

### Supporting other filetypes

By default, anvil.ejs works for .html, .ejs files.  You can also pass in an array of the file types you would like to run through ejs in you project like this:

```javascript
{
	"anvil.ejs": {
		"formats": ["foo", "bar", "html"]
	}
}
```
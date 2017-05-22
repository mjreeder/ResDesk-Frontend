# ResDesk - Frontend #


### Requirements ###
- npm 
- gulp

### Setup ###

- run `npm install` in the directory to install required packages
- run `npm install -g gulp` to install gulp

## Development ##

- run `gulp`
  - running `gulp` will automatically watch and compile Sass and JS
  - `gulp` will also host the project at [http://localhost:8080](http://localhost:8080)

## Production ##
- run `gulp build-prod` to generate minified versions of the final CSS and JS
- tweak the link and script imports in the index.html file to link to app.min.* instead of app.*

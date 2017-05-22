var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var prefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var shell = require('gulp-shell');

function handleError(err) {
  console.log(err.stack.toString());
  this.emit('end');
};

gulp.task('webserver', function () {
  connect.server({
    fallback: 'index.html',
    host: 'localhost',
    port: 8080,
    autoreload: true
  });
  gulp.src('./**/*.html').pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src('./src/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .pipe(prefixer())
    .pipe(concat('app.css'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-loading', function () {
  return gulp.src('./src/components/Other/components.loadingScreen.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .pipe(prefixer())
    .pipe(concat('components.loadingScreen.css'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-min', function () {
  return gulp.src('./src/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(prefixer())
    .pipe(concat('app.min.css'))
    .on('error', handleError)
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
  return gulp.src(['./src/**/**/app.js', './src/**/**/*.module.js', './src/**/**/*.js'])
    .pipe(babel({
      presets: ['es2015'],
      compact: false
    }))
    .on('error', handleError)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('js-min', function () {
  return gulp.src(['./src/**/**/app.js', './src/**/**/*.module.js', './src/**/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .on('error', handleError)
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', handleError)
    .pipe(uglify({
        mangle: false
      })
      .on('error', handleError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/**/**/*.js', ['js']);
  gulp.watch('./src/**/**/**/*.scss', ['sass']);
});

gulp.task('build-prod', ['sass', 'sass-loading', 'js', 'sass-min', 'js-min']);

gulp.task('docs', shell.task([
  'node_modules/jsdoc/jsdoc.js ' +
    '-c node_modules/angular-jsdoc/common/conf.json ' + // config file
    '-t node_modules/angular-jsdoc/angular-template ' + // template file
    '-d dist/docs ' + // output directory
    './README.md ' + // to include README.md as index contents
    '-r src' // source code directory
//    '-u tutorials'                              // tutorials directory
]));

gulp.task('default', ['sass', 'sass-loading', 'js', 'webserver', 'watch']);
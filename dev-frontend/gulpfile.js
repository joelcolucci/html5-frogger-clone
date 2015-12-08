var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();


gulp.task('copy-html', function() {
  gulp.src('./source/index.html')
    .pipe(gulp.dest('./production/'));
});


gulp.task('copy-images', function() {
  gulp.src('./source/images/*')
    .pipe(gulp.dest('./production/images/'));
});


gulp.task('styles', function() {
  gulp.src('./source/css/*')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./production/css'))
});


gulp.task('scripts', function() {
  gulp.src('./source/js/*')
    .pipe(gulp.dest('./production/js'));
});


gulp.task('default', ['copy-html', 'copy-images', 'styles', 'scripts'], function() {
  gulp.watch('./source/css/*', ['styles', browserSync.reload]);
  gulp.watch('./source/index.html', ['copy-html']);

  browserSync.init({
      server: "./production"
  });
});

var gulp = require('gulp')
var sass = require('gulp-sass')

gulp.task('genCss', function () {
  return gulp.src('css/main.scss')
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest('css/'));
});
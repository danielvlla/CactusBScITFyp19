var gulp = require('gulp')
var sass = require('gulp-sass')

gulp.task('mainCss', () => {
  return gulp.src('css/scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('css/'));
});

gulp.task('webviewCss', () => {
  return gulp.src('css/scss/webview.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('css/'));
});

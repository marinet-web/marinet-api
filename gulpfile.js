var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  ts = require('gulp-typescript'),
  tsProject = ts.createProject("./tsconfig.json"),
  livereload = require('gulp-livereload');

gulp.task('typescript', function() {
  console.log('Compiling typescript');
  return tsProject.src()
    .pipe(ts(tsProject)).js.pipe(gulp.dest('./deploy'));
});

gulp.task('watch', function() {
  gulp.watch('**/*.ts', ['typescript']);
});

gulp.task('serve', ['typescript'], function () {
  livereload.listen();
  nodemon({
    script: 'deploy/server.js',
    ext: 'js',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed();
    }, 500);
  });
});

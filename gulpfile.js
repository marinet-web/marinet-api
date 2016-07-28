var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  ts = require('gulp-typescript'),
  tsProject = ts.createProject("./tsconfig.json"),
  livereload = require('gulp-livereload'),
  mocha = require('gulp-mocha'),
  cover = require('gulp-coverage'),
  coveralls = require('gulp-coveralls');

gulp.task('typescript', function () {
  console.log('Compiling typescript');
  return tsProject.src()
    .pipe(ts(tsProject)).js.pipe(gulp.dest('./deploy'));
});

gulp.task('watch', function () {
  gulp.watch('**/*.ts', ['typescript']);
});

gulp.task('serve', ['typescript', 'watch'], function () {
  nodemon({
    script: 'deploy/server.js',
    ext: 'js',
  }).on('restart', function () { });
});

gulp.task('coveralls',['typescript'], function () {
  return gulp.src('deploy/test/**/*.js', { read: false })
    .pipe(cover.instrument({
      pattern: ['deploy/lib/**/*.js']
    }))
    .pipe(mocha()) // or .pipe(jasmine()) if using jasmine
    .pipe(cover.gather())
    .pipe(cover.format({ reporter: 'lcov' }))
    .pipe(coveralls());
});

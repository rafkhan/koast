var gulp = require('gulp');
var rg = require('rangle-gulp');

gulp.task('mocha', rg.mocha({
  files: 'lib/**/*.test.js',
  reporter: 'nyan'
}));

gulp.task('mocha-watch-run', rg.mocha({
  files: 'lib/**/*.test.js',
  reporter: 'nyan',
  errorHandler: function (err) {
    gulpUtil.log(err);
  }
}));

gulp.task('mocha-watch', function () {
  gulp.watch(['lib/**/*.js'], ['mocha-watch-run']);
});


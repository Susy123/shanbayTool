var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('sass',function(){
    return gulp.src('./css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', ['sass'], function () {
    gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('default', function() {
    console.log('test gulp');
    console.log('Tasks');
    console.log('----------------------');
    console.log('sass          编译scss文件');
    console.log('watch         开发监听');
    console.log('');
});



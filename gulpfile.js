const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify-es').default;
const rev = require('gulp-rev');
const imagemin = require('gulp-imagemin');
const del = require('del');
const revManifest = require('gulp-revmanifest');

gulp.task('css', function(done){
    console.log('minifying css......');
    gulp.src('./assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(revManifest({
        path: 'rev-manifest-css.json',
        cwd: 'public',
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js', function(done){
    console.log('minifying js.....');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(revManifest({
        path: 'rev-manifest-js.json',
        cwd: 'public',
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('images', function(done){
    console.log('compressing images.....');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(revManifest({
        path: 'rev-manifest-images.json',
        cwd: 'public',
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building Assets.....');
    done();
});
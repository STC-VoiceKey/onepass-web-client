'use strict';

var gulp = require('gulp'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    prefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    size = require('gulp-sizereport'),
    gettext = require('gulp-angular-gettext'),
    exit = require('gulp-exit'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/scripts/',
        css: 'build/styles/',
        img: 'build/images/',
        fonts: 'build/fonts/',
        translate: 'build/translations/',
    },
    src: {
        html: 'src/**/*.html',
        js: 'src/scripts/**/*.*',
        css: 'src/styles/*.css',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        translate: 'src/translations/'
    },
    clean: './build'
};

var testConfig = {
    ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
    },
    logLevel: "info",
    open: false,
    server: {
        baseDir: "./src",
        routes: {
            '/bower_components': 'bower_components'
        }
    },
    //proxy: '',
    notify: false,
    host: 'localhost',
    port: 9000
};

var prodConfig = {
    open: false,
    //logLevel: "debug",
    server: {
        baseDir: "./build"
    },
    //proxy: '',
    notify: false,
    /*tunnel: true,*/
    host: 'localhost',
    port: 9000
};

gulp.task('server', function() {
    browserSync(testConfig);
});


gulp.task('server:prod', function() {
    browserSync(prodConfig);
});

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('html', function() {
    return gulp.src(path.src.html)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify({
            mangle: false
        }).on('error', function(e){
            console.log(e);
        })))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.css', prefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })))
        .pipe(gulpIf('*.html', htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('images', function() {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('copy', function() {
    return gulp.src(path.src.translate + '*.json')
        .pipe(gulp.dest(path.build.translate));
});


gulp.task('pot', function() {
    return gulp.src(path.src.html)
        .pipe(gettext.extract('template.pot', {}))
        .pipe(gulp.dest('po/'))
        .pipe(exit())
});

gulp.task('translate', function() {
    return gulp.src('po/**/*.po')
        .pipe(gettext.compile({
            format: 'json'
        }))
        .pipe(gulp.dest(path.src.translate))
        .pipe(exit())
});

gulp.watch([
    path.src.html,
    path.src.js,
    path.src.css,
    path.src.img,
    path.src.fonts,
    path.src.translate + '*.json'
]).on('change', reload);

gulp.task('build', ['html', 'images', 'fonts', 'copy'], () => {
    return gulp.src('./build/**/*')
        .pipe(size({
            gzip: true
        }))
        .pipe(exit())
});

gulp.task('default', ['clean'], () => {
    gulp.start('build');
});
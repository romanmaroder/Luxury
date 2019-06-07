const path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: {
        html: 'app/pages/*.pug',
        js: 'app/js/main.js',
        css: 'app/less/main.less',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        html: 'app/pages/*.pug',
        js: 'app/js/main.js',
        css: 'app/less/**/*.less',
        img: 'app/image/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist/*'
};
// const config = {
//     server: {
//         baseDir: './dist',
//     },
//     notify: false
// };

const gulp = require('gulp');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const cache = require('gulp-cache');
const rimraf = require('gulp-rimraf');
const pug = require('gulp-pug');
// const webserver = require('browser-sync');

// gulp.task('webserver', function () {
//     webserver(config);
// });

gulp.task('html:build', function () {
    return gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.dist.html));
        // .pipe(webserver.reload({
        //     stream: true
        // }));
});

gulp.task('css:build', function () {

    return gulp.src(path.app.css)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer('> .5% or last 2 versions'))
        .pipe(gulp.dest(path.dist.css))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.dist.css));
        // .pipe(webserver.reload({
        //     stream: true
        // }));
});

gulp.task('js:build', function () {
    return gulp.src(path.app.js)
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.js))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js));
        // .pipe(webserver.reload({
        //     stream: true
        // }));
});

gulp.task('fonts:build', function () {
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('image:build', function () {
    return gulp.src(path.app.img)
        .pipe(cache(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ])))
        .pipe(gulp.dest(path.dist.img));
});

gulp.task('clean:build', function () {
    return gulp.src(path.clean, {
            read: false
        })
        .pipe(rimraf());
});

gulp.task('cache:clear', function () {
    cache.clearAll();
});

gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'image:build'
        )
    )
);

gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

gulp.task('default', gulp.series('build', gulp.parallel('watch')));
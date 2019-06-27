const path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        fontAwesome: 'dist/fonts/',
        libs: 'dist/libs/'

    },
    app: {
        html: 'app/pages/*.pug',
        js: 'app/js/main.js',
        css: 'app/less/main.less',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*',
        fontAwesome: './node_modules/@fortawesome/**',
        owl: ['./node_modules/owl.carousel/dist/assets/owl.carousel.min.css','./node_modules/owl.carousel/dist/assets/owl.theme.default.min.css']


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
const config = {
    server: {
        baseDir: './dist',
    },
    notify: false
};

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
const webserver = require('browser-sync');
const rigger = require('gulp-rigger');
const gcmq = require('gulp-group-css-media-queries');

gulp.task('webserver', function () {
    webserver(config);
});

gulp.task('html:build', function () {
    return gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.dist.html))
        .pipe(webserver.reload({
            stream: true
        }));
});

gulp.task('css:build', function () {
    return gulp.src(path.app.css)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer('> .5% or last 2 versions'))
        .pipe(gcmq())
        .pipe(gulp.dest(path.dist.css))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.dist.css))
        .pipe(webserver.reload({
            stream: true
        }));
});

gulp.task('js:build', function () {
    return gulp.src(path.app.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.js))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
        .pipe(webserver.reload({
            stream: true
        }));
});

gulp.task('fonts:build', function () {
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('icons:build', function () {
    return gulp.src([path.app.fontAwesome,
            '!node_modules/@fortawesome/fontawesome-free/**/*.map',
            '!node_modules/@fortawesome/fontawesome-free/.npmignore',
            '!node_modules/@fortawesome/fontawesome-free/js/**',
            '!node_modules/@fortawesome/fontawesome-free/svgs/**',
            '!node_modules/@fortawesome/fontawesome-free/sprites/**',
            '!node_modules/@fortawesome/fontawesome-free/webfonts/*.svg',
            '!node_modules/@fortawesome/fontawesome-free/*.txt',
            '!node_modules/@fortawesome/fontawesome-free/*.md',
            '!node_modules/@fortawesome/fontawesome-free/*.json',
            '!node_modules/@fortawesome/fontawesome-free/less/**',
            '!node_modules/@fortawesome/fontawesome-free/scss/**'
        ])
        .pipe(gulp.dest(path.dist.fontAwesome));
});

gulp.task('owl:build', function () {
    return gulp.src(path.app.owl)
        .pipe(gulp.dest(path.dist.libs));
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
            'icons:build',
            'owl:build',
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

gulp.task('default', gulp.series('build', gulp.parallel('webserver','watch')));
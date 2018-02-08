'use strict';

/*
 * MEDIATEC
 */

/////////////////////////////////////////////////////////////////////////////
// GULP PLUGINS

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    ignore = require('gulp-ignore'),
    rimraf = require('gulp-rimraf'),
    browserSync = require("browser-sync"),
    wrap = require('gulp-wrap'),
    template = require('gulp-template'),
    data = require('gulp-data'),
    print = require('gulp-print'),
    replace = require('gulp-replace-task'),
    reload = browserSync.reload,
    rename = require('gulp-rename'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    cheerio = require('gulp-cheerio'),
    argv = require('yargs').argv;

/////////////////////////////////////////////////////////////////////////////
// GULP PATHS

var path = {
    src: {
        sites: 'src/sites/**/*.*',
        templates: 'src/templates/**/*.*',
        img: 'src/assets/img/**/*',
        css: 'src/assets/css/main.scss',
        js: 'src/assets/js/**/*.*',
        fonts: 'src/assets/fonts/**/*.{ttf,woff,woff2,eot,svg}',
        vendors_by_bower: 'src/assets/vendors/by_bower/**/*.*',
        vendors_by_hands: 'src/assets/vendors/by_hands/**/*.*',
        svg_sprite: 'src/assets/img/svg-sprite/*.svg'
    },
    build: {
        sites: 'dist/sites/',
        img: 'dist/assets/img/',
        css: 'dist/assets/css/',
        js: 'dist/assets/js/',
        vendors: 'dist/assets/vendors/',
        fonts: 'dist//assets/fonts/'
    },
    watch: {
        css: 'src/assets/css/**/*.*'
    },
    clean: ['dist/*']
};

/////////////////////////////////////////////////////////////////////////////
// PRINT ERRORS

function printError(error) {
    console.log(error.toString()); // print error
    this.emit('end'); // end task
}

/////////////////////////////////////////////////////////////////////////////
// BROWSERSYNC SERVE

var config = {
    server: {
        baseDir: "./dist/", // base dir path
        directory: true // show as directory
    },
    tunnel: false, // tunnel
    host: 'localhost', // host
    port: 9000, // port
    logPrefix: "frontend", // console log prefix
    files: ['./dist/**/*'], // files path for changes watcher
    watchTask: true // watcher on/off
};

gulp.task('serve', function () {
    browserSync(config); // run BrowserSync
});


/////////////////////////////////////////////////////////////////////////////
// BUILD STRUCTURE

gulp.task('build:structure', function () {
    gulp.src(path.src.sites) // get sites
        .pipe(ignore.exclude('**/_head.html')) // exclude _head.html file
        .pipe(rigger()) // include component templates to generated pages
        .pipe(template()) // replace DATA variables
        .on('error', printError) // print error if found
        .pipe(gulp.dest(path.build.sites)) // copy generated pages to build folder
        .pipe(reload({stream: true})); // reload BrowserSync
});

/////////////////////////////////////////////////////////////////////////////
// VENDORS BUILD

gulp.task('build:vendors', function() {
    return gulp.src([path.src.vendors_by_bower, path.src.vendors_by_hands]) // get folders with vendors components
        .pipe(gulp.dest(path.build.vendors)); // copy to destination folder
});

/////////////////////////////////////////////////////////////////////////////
// JAVASCRIPT BUILD

gulp.task('build:js', function () {
    return gulp.src(path.src.js) // get folder with js
        .pipe(gulp.dest(path.build.js)) // copy to destination folder
        .pipe(reload({stream: true})); // reload BrowserSync
});

/////////////////////////////////////////////////////////////////////////////
// STYLES BUILD

gulp.task('build:css', function () {
    setTimeout(function() {
        gulp.src(path.src.css) // get folder with css
        // .pipe(ignore.exclude('**/mixins.scss')) // exclude mixins.scss file
        .pipe(sass({outputStyle: 'expanded', indentWidth: 4})) // css formatting
        .on('error', printError) // print error if found
        .pipe(autoprefix({
            browsers: ['last 30 versions', '> 1%', 'ie 9'],
            cascade: true
        })) // add cross-browser prefixes
        .pipe(gulp.dest(path.build.css))  // copy sources
        .pipe(reload({stream: true})); // reload BrowserSync
    }, 200);
});

/////////////////////////////////////////////////////////////////////////////
// IMAGES BUILD

gulp.task('build:img', function () {
    gulp.src(path.src.img, {base: path.src.modules}) // get folder with images
        .on('error', printError) // print error if found
        .pipe(gulp.dest(path.build.img)); // copy to destination folder
});


/////////////////////////////////////////////////////////////////////////////
// SVG SPRITES BUILD

gulp.task('build:svg_sprite', function() {
    return gulp.src(path.src.svg_sprite)
    .pipe(svgmin(function(file) {
        return {
            plugins:[{
                cleanupIDs: {
                    minify: true
                },
            }]
        }
    }))
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(cheerio({
        run: function($) {
            $('svg').attr('style', 'display: none');
        },
        parserOptions: {
            xmlMode: true
        }
    }))
    .pipe(rename('sprite-svg.svg'))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

/////////////////////////////////////////////////////////////////////////////
// FONTS BUILD

gulp.task('build:fonts', function() {
    return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({stream: true}));
});

/////////////////////////////////////////////////////////////////////////////
// GLOBAL BUILD

gulp.task('build', [
    'build:structure', // run build:html task
    'build:fonts', // run build:fonts task
    'build:css', // run build:css task
    'build:js', // run build:js task
    'build:img', // run build:img task
    'build:svg_sprite', // run build:svg_sprite task
    'build:vendors' // run build:vendors task
]);

/////////////////////////////////////////////////////////////////////////////
// FILES CHANGE WATCHER

gulp.task('watch', function(){
    watch([path.src.sites, path.src.templates], function() { // watch sites folders
        gulp.start('build:structure'); // run build:structure task
    });
    watch([path.watch.css], function() { // watch css folder
        gulp.start('build:css'); // run build:css task
    });
    watch([path.src.js], function() { // watch js folder
        gulp.start('build:js'); // run build:js task
    });
    watch([path.src.img], function() { // watch img folder
        gulp.start('build:img'); // run build:img task
    });
    watch([path.src.fonts], function() { // watch fonts folder
        gulp.start('build:fonts'); // run build:fonts task
    });
    watch([path.src.vendors_by_bower, path.src.vendors_by_hands], function() { // watch folder with vendors components
        gulp.start('build:vendors'); // run build:vendors task
    });
});

/////////////////////////////////////////////////////////////////////////////
// CLEAN PRODUCTION

gulp.task('clean', function () {
    return gulp.src(path.clean) // get build folder
        .pipe(rimraf()); // erase all
});

/////////////////////////////////////////////////////////////////////////////
// DEFAULT TASK

gulp.task('default', ['build', 'watch', 'serve']);
let sourceFolder = "app",
    projectFolder = require("path").basename(__dirname),
    imagesWatch  = "{jpg,jpeg,png,webp,svg}"

let path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        fonts: projectFolder + "/fonts/",
        images: projectFolder + "/images/"
    },
    src: {
        html: sourceFolder + "/*.html",
        css: sourceFolder + "/scss/main.scss",
        js: sourceFolder + "/js/index.js",
        fonts: sourceFolder + "/fonts/*.ttf",
        images: sourceFolder + "/images/**/*." + imagesWatch
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        images: sourceFolder + "/images/**/*." + imagesWatch
    },
    clean: "./" + projectFolder + "/"
}

const { src, dest, parallel, series, watch } = require('gulp');
const browsersync  = require('browser-sync').create(),
      del = require('del'),
      scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCss = require('gulp-clean-css'),
      uglify = require('gulp-uglify-es').default,
      concat = require('gulp-concat'),
      imagemin = require('gulp-imagemin'),
      ttf2woff2 = require('gulp-ttf2woff2'),
      groupMedia = require('gulp-group-css-media-queries');

function browserSync () {
    browsersync.init({
        server: {baseDir: "./" + projectFolder + "/"},
        notify: false,
        online: true
    })
}

function html () {
    return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function images () {
    return src(path.src.images)
    .pipe(imagemin({
        progressive: true, 
        svgoPlugins: [{removeViewBox: false}], 
        interlaced: true, optimization: 3
    }))
    .pipe(dest(path.build.images))
}

function fonts () {
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

function css () {
    return src(path.src.css)
    .pipe(scss({outputStyle: "compressed"}))
    .pipe(groupMedia())
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], cascade: true }))
    .pipe(cleanCss({level: { 1: { specialComments: 0 } }}))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js () {
    return src(path.src.js)
    .pipe(concat("index.min.js"))
    .pipe(uglify())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function watchFiles() {
	watch([path.watch.html], html);
	watch([path.watch.css], css); 
	watch([path.watch.js], js);
	watch([path.watch.images], images);
}

function clean () {
    return del(path.clean)
}

let build = series(clean, css, html, js, images, fonts);

exports.browserSync = browserSync;
exports.build = build
exports.html = html;
exports.css = css;
exports.images = images;
exports.js = js;
exports.fonts = fonts;
exports.default = parallel(build, watchFiles, browserSync);
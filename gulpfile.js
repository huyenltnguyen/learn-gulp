var gulp = require("gulp");
var uglify = require("gulp-uglify");
var livereload = require("gulp-livereload");
var minifyCSS = require("gulp-minify-css");
var prefix = require("gulp-autoprefixer");
var concatCSS = require("gulp-concat-css");
var sass = require("gulp-sass");
var jshint = require("gulp-jshint");
var jshintStylish = require("jshint-stylish");
var concat = require("gulp-concat");
var imagemin = require("gulp-imagemin");

// handles gulp errors
function handleErrors(error) {
	console.log(error);
	this.emit("end");
}

// optimize images
gulp.task("imagemin", () =>
    gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("build/img"))
);

// copy all HTML files
gulp.task("copyHtml", function(){
  gulp.src("src/*.html")
      .pipe(gulp.dest("build"));
});

// reload html files
gulp.task("html:reload", function() {
	gulp.src("src/*.html")
		.pipe(livereload({auto:false}));
});

// modifies styles
gulp.task('styles', function() {
	console.log("starting styles!");
	gulp.src("src/css/styles.scss")
		.pipe(sass())
		.on("error", handleErrors)
		.pipe(prefix())
		.pipe(minifyCSS())
		.pipe(gulp.dest("build/css/"));
});

// reloads styles
gulp.task("styles:reload", function() {
	gulp.src("src/css/styles.scss")
		.pipe(livereload({auto:false}));
});

// modifies vendor styles
gulp.task("styles:vendor", function() {
	gulp.src("src/vendor/css/**/*.css")	// match any files inside src/vendor/css that are inside of any folders (**) that have the .css extension
		.pipe(concatCSS("vendor.min.css"))
		.pipe(minifyCSS())
		.pipe(gulp.dest("build/css/"));
});

// reloads vendor styles
gulp.task("styles:vendor:reload", function() {
	gulp.src("src/vendor/css/**/*.css")
		.pipe(livereload({auto:false}));
});

// modifies scripts
gulp.task('scripts', function() {
	console.log("starting scripts");
	gulp.src("src/js/**/*.js")
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish))
		.pipe(jshint.reporter("fail"))
		.on("error", function() {
			this.emit("end");	
		})
		.pipe(concat("scripts.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("build/js/"));
});

// reloads scripts
gulp.task("scripts:reload", function() {
	gulp.src("src/js/main.js")
		.pipe(livereload({auto:false}));
});

// watches files
gulp.task("watch", function() {

	livereload.listen();

	gulp.watch('src/img/*', ['imagemin']);

	gulp.watch("src/*.html", ["copyHtml", "html:reload"]);

	gulp.watch("src/js/**/*.js", ["scripts", "scripts:reload"]);

	gulp.watch("src/css/styles.scss", ["styles", "styles:reload"]);

	gulp.watch("src/vendor/css/**/*.css", ["styles:vendor", "styles:vendor:reload"]);
});

// run all gulp tasks
gulp.task("default", function() {
	gulp.start("styles", "scripts")
});
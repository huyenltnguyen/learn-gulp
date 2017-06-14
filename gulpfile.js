var gulp = require("gulp");
var uglify = require("gulp-uglify");
var livereload = require("gulp-livereload");
var minifyCSS = require("gulp-minify-css");
var prefix = require("gulp-autoprefixer");
var concatCSS = require("gulp-concat-css");
var sass = require("gulp-sass");

// handles gulp errors
function handleErrors(error) {
	console.log(error);
	this.emit("end");
}

// modifies styles
gulp.task('styles', function() {
	console.log("starting styles!");
	gulp.src("public/css/styles.scss")
		.pipe(sass())
		.on("error", handleErrors)
		.pipe(prefix())
		.pipe(minifyCSS())
		.pipe(gulp.dest("public/build/css/"));
});

// reloads styles
gulp.task("styles:reload", function() {
	gulp.src("public/css/styles.scss")
		.pipe(livereload({auto:false}));
});

// modifies vendor styles
gulp.task("styles:vendor", function() {
	gulp.src("public/vendor/css/**/*.css")	// match any files inside public/vendor/css that are inside of any folders (**) that have the .css extension
		.pipe(concatCSS("vendor.min.css"))
		.pipe(minifyCSS())
		.pipe(gulp.dest("public/build/css/"));
});

// reloads vendor styles
gulp.task("styles:vendor:reload", function() {
	gulp.src("public/vendor/css/**/*.css")
		.pipe(livereload({auto:false}));
});

// modifies scripts
gulp.task('scripts', function() {
	console.log("starting scripts");
	gulp.src("public/js/main.js")
		.pipe(uglify())
		.pipe(gulp.dest("public/build/js/"));
});

// reloads scripts
gulp.task("scripts:reload", function() {
	gulp.src("public/js/main.js")
		.pipe(livereload({auto:false}));
});

// watches files
gulp.task("watch", function() {
	livereload.listen();

	gulp.watch("public/js/main.js", ["scripts", "scripts:reload"]);

	gulp.watch("public/index.html")
		.on("change", livereload.changed);

	gulp.watch("public/css/styles.scss", ["styles", "styles:reload"]);

	gulp.watch("public/vendor/css/**/*.css", ["styles:vendor", "styles:vendor:reload"]);		
});

// run all gulp tasks
gulp.task("default", function() {
	gulp.start("styles", "scripts")
});
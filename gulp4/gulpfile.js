// Gilp-pack v1.0 for gulp 4.0 and ES2015 made by Yan Pustynnyy
// Heavily inspired by my mentors and colleagues at WebCademy.ru 

//  Variable initializing
const gulp = require('gulp'),
	sass = require('gulp-sass'),					
	browserSync = require('browser-sync').create(),
	notify = require('gulp-notify'), 				// For error messaging in console
	autoprefixer = require('gulp-autoprefixer'),
    optimizer = require('gulp-imagemin'),
    minify = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require('gulp-plumber'), 	
    concat = require('gulp-concat'),
	clean = require('gulp-clean'),
    wait = require('gulp-wait');
	del = require('del');

gulp.task('sass', () => {
    return gulp.src('src/scss/**/*.scss').
    	pipe(plumber({
    		errorHandler: notify.onError(function(err){
    			return {
    				title: 'SCSS ERROR',
    				message: err.message
    			}
    		})
    	}))
        // .pipe(concat('main.scss'))
        // .pipe(gulp.dest('./src/scss/'))
    	.pipe(sourcemaps.init())
        .pipe(wait(500))
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('src/css/'))
        .pipe(browserSync.stream());
});


// Delete build directory
gulp.task('clean:build', () => {
    return del('./build');
});

gulp.task('clean:css', () => {
    return del('./src/css/main.css');
});

// Copy js files from source directory to build
gulp.task('copy:js', () => {
    return gulp.src('./src/js/**/*.*')
    	.pipe(gulp.dest('./build/js/'))
    	.pipe(browserSync.stream());
});

gulp.task('copy:php', () => {
    return gulp.src('./src/php/**/*.*')
        .pipe(gulp.dest('./build/php/'))
        .pipe(browserSync.stream());
});

gulp.task('copy:files', () => {
    return gulp.src('./src/files/**/*.*')
        .pipe(gulp.dest('./build/files/'))
        .pipe(browserSync.stream());
});

// Copy fonts from source directory to build
gulp.task('copy:fonts', () => {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts/'))
        .pipe(browserSync.stream());
});

// Copy libraries from source directory to build
gulp.task('copy:lib', () => {
    return gulp.src('./src/libs/**/*.*')
    	.pipe(gulp.dest('./build/libs/'))
    	.pipe(browserSync.stream());
});

// Copy images from source directory to build
// gulp.task('copy:img', () => {
//     return gulp.src('./src/img/**/*.*')
//     	.pipe(gulp.dest('./build/img/'))
//     	.pipe(browserSync.stream());
// });

// Copy html files from source directory to build
gulp.task('copy:html', () => {
    return gulp.src('./src/*.html')
    	.pipe(gulp.dest('./build/'))
    	.pipe(browserSync.stream());
});

gulp.task('copy:ico', () => {
    return gulp.src('./src/*.ico')
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream());
});

gulp.task('minify-css', () => {
    return gulp.src('./src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(minify({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());
});

gulp.task('minify-js', () => {
    return gulp.src('.src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('optimize-images', () => {
    return gulp.src(['./src/img/**/*.png', './src/img/**/*.jpg', './src/img/**/*.svg'])
        .pipe(optimizer({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./build/img/'))
        .pipe(browserSync.stream());
});

// Watch over all the important folders and refresh the page if changes were made
gulp.task('server', () => {
    browserSync.init({
        server: { baseDir: './build'}
    })
    gulp.watch('./src/scss/**/*.scss').on('change', gulp.series('sass', 'minify-css', reload));
    gulp.watch('./src/js/**/*.js').on('change', gulp.series('copy:js'));
    gulp.watch('./src/php/**/*.*').on('change', gulp.series('copy:php'));
    gulp.watch('./src/libs/**/*.*').on('change', gulp.series('copy:lib'));
    gulp.watch('./src/img/**/*.*').on('change', gulp.series('optimize-images', reload));
    gulp.watch('src/*.html').on('change', gulp.series('copy:html', reload));
    gulp.watch('.src/*.ico').on('change', gulp.series('copy:ico', reload));
});

function reload(done) {
	browserSync.reload();
	done();
}

gulp.task('default',
    gulp.series('clean:build', 'clean:css',
    	gulp.parallel('sass','copy:fonts', 'copy:html',  'copy:php', 'copy:ico', 'copy:files', 'copy:lib', 'copy:js', 'optimize-images'), 'minify-css', 'server'
    )
);




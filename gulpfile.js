'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');

gulp.task('browserify-index', function() {
	return gulp.src('index.js')
		.pipe(replace(/(require\s?\(['"](?:\.\/)?)lib(\/.*['"]\))/g, '$1lib-browser$2'))
		.pipe(replace(/module\.exports(\s?=.*)/g, 'window.coinbase$1'))
		.pipe(rename('browser.js'))
		.pipe(gulp.dest('.'));
});
 
gulp.task('browserify-dependencies', function() {
	return gulp.src('lib/**/*.js')
		.pipe(replace(/(require\s?\(['"])request(['"]\))/g, '$1browser-request$2'))
		.pipe(replace(/(require\s?\(['"])crypto(['"]\))/g, '$1crypto-browserify$2'))
		.pipe(gulp.dest('lib-browser/'));
});

gulp.task('browserify', ['browserify-index', 'browserify-dependencies'], function() {
	return gulp.src('./browser.js')
		.pipe(browserify({}))
		.pipe(gulp.dest('build/'));
});
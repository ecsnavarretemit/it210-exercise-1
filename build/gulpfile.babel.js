/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Bootstrap File
 *   - structure based on gulp starter <https://github.com/greypants/gulp-starter>
 *
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import appModulePath from 'app-module-path';
import requireDir from 'require-dir';
import yargs from 'yargs';
import _ from 'lodash';

let argv = yargs.argv;

// change the current working directory if `--build-cwd` argument is specified
if ( !_.isUndefined(argv['build-cwd']) ) {
    gutil.log( 'Setting Current Working Directory to', gutil.colors.green(argv['build-cwd']) );

    process.chdir( argv['build-cwd'] );
}

// add new module search path
appModulePath.addPath( __dirname + '/gulp' );

// require all gulp tasks
requireDir( './gulp/tasks', {
    recurse: true
});

// export the gulp object when the developer user gulp-devtools to run gulp task from chrome devtools.
export default gulp;



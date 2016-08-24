/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * bundleLogger
 *   - Provides gulp style logs to the bundle method in browserify.js
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gutil from 'gulp-util';
import prettyHrtime from 'pretty-hrtime';

let startTime;

export default {
    start: (filepath) => {
        startTime = process.hrtime();
        gutil.log( 'Bundling', gutil.colors.green(filepath) + '...' );
    },

    watch: (bundleName) => {
        gutil.log( 'Watching files required by', gutil.colors.yellow(bundleName) );
    },

    end: (filepath) => {
        let taskTime   = process.hrtime(startTime);
        let prettyTime = prettyHrtime(taskTime);

        gutil.log( 'Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime) );
    }
};



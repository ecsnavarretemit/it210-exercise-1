/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Copy Fonts Task
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import mergeStream from 'merge-stream';
import { config } from 'config';

function copyFonts() {
    function cp(config) {
        return gulp
            .src( config.src )
            .pipe( gulp.dest(config.dest) )
            ;
    }

    return mergeStream.apply( gulp, _.map(config.copyfonts, cp) );
}

gulp.task( 'copyfonts', (cb) => {
    if ( _.isUndefined(config.copyfonts) || config.copyfonts.length === 0 ) {
        cb();
        return;
    }

    return copyFonts();
});



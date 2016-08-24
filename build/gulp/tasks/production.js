/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Production Task
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task( 'production', (cb) => {
    runSequence(
        'clean:all',
        [
            'concatjs:prod',
            'es6:prod',
            'sass:prod'
        ],
        cb
    );
});



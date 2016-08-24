/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Default Task
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import runSequence from 'run-sequence';
import { TASKS_ENABLED } from 'config';

gulp.task( 'default', (cb) => {
    let params = TASKS_ENABLED.slice( 0 );

    params.push( cb );

    runSequence.apply( null, params );
});

// remove browser-sync task when spawning this gulp task
gulp.task( 'default:resurrect', (cb) => {
    let params = _.filter( TASKS_ENABLED.slice( 0 ), (task) => {
        return task !== 'browser-sync';
    });

    params.push( cb );

    runSequence.apply( null, params );
});



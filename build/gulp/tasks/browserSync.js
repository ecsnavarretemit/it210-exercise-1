/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp - BrowserSync
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import { config } from 'config';
import browserSync from 'browser-sync';

gulp.task( 'browser-sync', (cb) => {
    browserSync( config.browserSync, cb );
});



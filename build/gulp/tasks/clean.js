/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Clean Task
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import del from 'del';
import { config } from 'config';

gulp.task('clean:all', () => {
    return del( config.clean.all );
});



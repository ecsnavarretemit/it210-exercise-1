/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Watch Tasks Cleaner
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */
'use strict';

import fs from 'fs';
import gutil from 'gulp-util';
import WatcherFactory from './watcher.factory';
import { PID_FILE } from 'config';

let cleaner = () => {
    let stats;

    let pidfile = PID_FILE;

    try {
        stats = fs.statSync( pidfile );

        fs.unlink( pidfile );
    } catch (e) {
        // pid file does not exist
    }

    if ( WatcherFactory.count() > 0 ) {
        gutil.log( gutil.colors.red('Closing all existing watchers!') );

        WatcherFactory.closeAll();
    } else {
        gutil.log( gutil.colors.blue('No existing watchers.') );
    }

    gutil.log( gutil.colors.red('Done cleaning all existing watchers. Terminating Gulp!') );
};

let sigIntHandler = () => {
    cleaner();

    // finally terminate the process.
    // NOTE: this line is essential since we are overriding the default behavior of SIGINT,
    //       it is mandatory that we should manually close the process.
    process.exit( 2 );
};

let uncaughtExceptionHandler = (err) => {
    cleaner();

    // output the stack trace
    console.log( err.stack );

    // finally terminate the process.
    // NOTE: this line is essential since we are overriding the default behavior of uncaughtException,
    //       it is mandatory that we should manually close the process.
    process.exit( 99 );
};

process
    .removeListener( 'SIGINT', sigIntHandler )
    .on( 'SIGINT', sigIntHandler );

// catch uncaught exception event. perform cleanup and show error stack
process
    .removeListener( 'uncaughtException', uncaughtExceptionHandler )
    .on( 'uncaughtException', uncaughtExceptionHandler );

// export the cleaner function and the event handlers so that we can use it later.
export {
    cleaner,
    sigIntHandler,
    uncaughtExceptionHandler
};



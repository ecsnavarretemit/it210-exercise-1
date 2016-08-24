/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Configuration Task
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import childProcess from 'child_process';
import gulpLoadPlugins from 'gulp-load-plugins';
import WatcherFactory from 'lib/watcher/watcher.factory';
import { PID_FILE } from 'config';

// load all the gulp plugins available to avoid multiple import calls
let plugins = gulpLoadPlugins();

// paths
let configPath = path.resolve( __dirname, '../config.js' );
let basePath   = path.resolve( __dirname, '../..' );

// remove node and gulp and the process-hack arguments from the process params
let processParams = _.slice( process.argv, 2 );

gulp.task( 'configuration:watch', function (cb) {
    let pidfile = PID_FILE;
    let childP;

    WatcherFactory.create( configPath, {}, () => {
        let stats, pid;

        // show message before restarting gulp process
        plugins.util.log( plugins.util.colors.red('Configuration File changed. Restarting Gulp!') );

        // close all existing watchers
        WatcherFactory.closeAll();

        try {
            stats = fs.statSync( pidfile );

            pid = fs.readFileSync( pidfile, {
                encoding: 'utf8'
            });
        } catch (e) {
            // pid file does not exist
        }

        // kill the existing process if there is any
        if ( pid ) {
            fs.unlink( pidfile );

            process.kill( pid );
        }

        if ( !_.includes(processParams, 'default:resurrect') ) {
            processParams.push( 'default:resurrect' );
        }

        // respawn the task
        childP = childProcess.spawn( 'gulp', processParams, {
            stdio: 'inherit',
            cwd: basePath
        });

        fs.writeFileSync( pidfile, childP.pid );
    });

    // execute the callback to mark this task has been executed. (required by run-sequence)
    cb();
});



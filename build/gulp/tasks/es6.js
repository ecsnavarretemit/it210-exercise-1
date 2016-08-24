/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp ES6 Task
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import mergeStream from 'merge-stream';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import exorcist from 'exorcist';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import { config } from 'config';

// Browserify
import browserify from 'browserify';
import babelify from 'babelify';
import es2015  from 'babel-preset-es2015';
import watchify from 'watchify';

// Watcher Libraries
import WatcherFactory from 'lib/watcher/watcher.factory';
import WatchifyWatcher from 'lib/watcher/watchify.watcher';

// Utilities
import bundleLogger from 'util/bundleLogger';
import handleErrors from 'util/handleErrors';

// load all the gulp plugins available to avoid multiple import calls
let plugins = gulpLoadPlugins();

function es6Task(production) {
    if ( _.isUndefined(production) ) {
        production = false;
    }

    function compile(bundleConfig) {
        if( !production ) {
            // A watchify require/external bug that prevents proper recompiling,
            // so (for now) we'll ignore these options during development. Running
            // `gulp browserify` directly will properly require and externalize.
            bundleConfig = _.omit( bundleConfig, [
                'external',
                'require'
            ]);
        }

        // Add watchify args and debug (sourcemaps) option
        _.extend( bundleConfig, watchify.args, {
            debug: true
        });

        var b = browserify( bundleConfig );

        var bundle = (changedFiles) => {
            let mapFile = bundleConfig.dest + '/' + bundleConfig.outputName + '.map';
            let message = 'JavaScript files are now being linted and recompiled.';

            // show notification if browsersync is active
            if ( browserSync.active ) {
                browserSync.notify( message, 5000 );
            }

            // Log when bundling starts
            bundleLogger.start( bundleConfig.outputName );

            let compile = b.bundle()
                // Report compile errors
                .on( 'error', handleErrors )
                // extract inline source map to an external source map file
                .pipe( exorcist(mapFile) )
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specify the
                // desired output filename here.
                .pipe( source(bundleConfig.outputName) )
                // Specify the output destination
                .pipe( gulp.dest(bundleConfig.dest) )
                .pipe( plugins.if(browserSync.active, browserSync.reload({
                    stream: true
                })))
                ;

            if ( production ) {
                compile
                    .pipe( plugins.rename({
                        suffix: '.min'
                    }))
                    .pipe( buffer() )
                    .pipe( plugins.uglify() )
                    .pipe( gulp.dest(bundleConfig.dest) )
                    ;
            }

            if ( !_.isUndefined(changedFiles) ) {
                let lintStream = gulp.src( changedFiles )
                    .pipe( plugins.jshint() )
                    .pipe( plugins.jshint.reporter('jshint-stylish') )
                    .pipe( plugins.jshint.reporter('fail') )
                    .on( 'error', plugins.notify.onError({
                        title: "JSHint Error",
                        message: 'Error: <%= error.message %>'
                    }))
                    ;

                return mergeStream( lintStream, compile );
            }

            return compile;
        };

        if( !production ) {
            // Wrap with watchify and rebundle on changes
            b = watchify( b );

            // add to the list of watchers that needs to be freed on script termination.
            WatcherFactory.add( new WatchifyWatcher(b) );

            // Rebundle on update
            b.on( 'update', bundle );

            bundleLogger.watch( bundleConfig.outputName );
        } else {
            // Sort out shared dependencies.
            // b.require exposes modules externally
            if( bundleConfig.require ) {
                b.require( bundleConfig.require );
            }

            // b.external excludes modules from the bundle, and expects
            // they'll be available externally
            if( bundleConfig.external ) {
                b.external( bundleConfig.external );
            }
        }

        // transform es6+ code using babelify transform
        b.transform( babelify, {
            presets: [es2015]
        });

        return bundle();
    }

    // Start bundling with Browserify for each bundleConfig specified
    return mergeStream.apply( gulp, _.map(config.es6.bundleConfigs, compile) );
}

gulp.task( 'es6:dev', (cb) => {
    // when the bundle config for es6 task is empty invoke the callback for the gulp task to 
    // immediately proceed to other remaining tasks
    if ( config.es6.bundleConfigs.length === 0 ) {
        cb();

        return;
    }

    return es6Task();
});

gulp.task( 'es6:prod', (cb) => {
    // when the bundle config for es6 task is empty invoke the callback for the gulp task to 
    // immediately proceed to other remaining tasks
    if ( config.es6.bundleConfigs.length === 0 ) {
        cb();

        return;
    }

    return es6Task( true );
});

// export the task so that we can re-use it in other parts
export default es6Task;



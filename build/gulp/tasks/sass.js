/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Sass Task
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import mergeStream from 'merge-stream';
import browserSync from 'browser-sync';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import handleErrors from 'util/handleErrors';
import { PROJECT_ROOT, config } from 'config';

// load all the gulp plugins available to avoid multiple import calls
let plugins = gulpLoadPlugins();

function sassTask(production) {
    if ( _.isUndefined(production) ) {
        production = false;
    }

    function compileSass(compileConfig) {
        let generateSourceMap = false;

        if ( !_.isUndefined(compileConfig.sourcemaps) ) {
            generateSourceMap = compileConfig.sourcemaps;
        }

        let src        = path.resolve( PROJECT_ROOT, compileConfig.src );
        let dest       = path.resolve( PROJECT_ROOT, compileConfig.dest );
        let sourceRoot = '/' + _.trimStart(path.dirname(compileConfig.src) + '/');

        browserSync.notify( 'Refreshing CSS' );

        let compile = gulp.src( src )
            .pipe( plugins.if(generateSourceMap, plugins.sourcemaps.init() ))
                .pipe( plugins.sass(compileConfig.sassOptions).on('error', handleErrors) )
            .pipe( plugins.if(generateSourceMap, plugins.sourcemaps.write('.', {
                includeContent: false,
                sourceRoot: sourceRoot
            })))
            .pipe( gulp.dest(dest) )
            .pipe( plugins.if(browserSync.active, browserSync.stream({
                match: '**/*.css'
            })))
            ;

        // apply minification when production variable is set to true.
        if ( production ) {
            let minify = gulp.src( src )
                .pipe( plugins.sass(compileConfig.sassOptions).on('error', handleErrors) )
                .pipe( plugins.rename({
                    suffix: '.min'
                }))
                .pipe( plugins.if(generateSourceMap, plugins.sourcemaps.init() ))
                    .pipe( plugins.cleanCss({
                        keepSpecialComments: 0
                    }))
                .pipe( plugins.if(generateSourceMap, plugins.sourcemaps.write('.', {
                    includeContent: false,
                    sourceRoot: sourceRoot
                })))
                .pipe( gulp.dest(dest) )
                ;

            return mergeStream( compile, minify );
        }

        return compile;
    }

    return mergeStream.apply( gulp, _.map(config.sass, compileSass) );
}

gulp.task( 'sass:dev', (cb) => {
    // when the bundle config for sass task is empty invoke the callback for the gulp task to 
    // immediately proceed to other remaining tasks
    if ( config.sass.length === 0 ) {
        cb();

        return;
    }

    return sassTask();
});

gulp.task( 'sass:prod', (cb) => {
    // when the bundle config for sass task is empty invoke the callback for the gulp task to 
    // immediately proceed to other remaining tasks
    if ( config.sass.length === 0 ) {
        cb();

        return;
    }

    return sassTask( true );
});

gulp.task( 'sass:watch', () => {
    let globs = _.map( config.sass, (sassConfig) => {
        let relative = path.resolve( PROJECT_ROOT, sassConfig.src );

        return path.dirname( relative ) + '/**/*' + path.extname( sassConfig.src );
    });

    gulp.watch( globs, ['sass:dev'] );
});

// export the task so that we can re-use it in other parts
export default sassTask;



/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Concat JS Task
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */
'use strict';

import gulp from 'gulp';
import _ from 'lodash';
import mergeStream from 'merge-stream';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import { PROJECT_ROOT, config } from 'config';

// load all the gulp plugins available to avoid multiple import calls
let plugins = gulpLoadPlugins();

function concatJsTask(production) {
    if ( _.isUndefined(production) ) {
        production = false;
    }

    function concatJs(compileConfig) {
        let src  = [];
        let dest = path.resolve( PROJECT_ROOT, compileConfig.dest );

        if ( _.isArray(compileConfig.src) ) {
            src = _.map( compileConfig.src, (src) => {
                return path.resolve( PROJECT_ROOT, src );
            });
        } else {
            src = path.resolve( PROJECT_ROOT, compileConfig.src );
        }

        let compile = gulp.src( src )
            .pipe( plugins.concat(compileConfig.outputName) )
            .pipe( gulp.dest(dest) )
            ;

        // apply minification when production variable is set to true.
        if ( production ) {
            let minify = gulp.src( src )
                .pipe( plugins.concat(compileConfig.outputName) )
                .pipe( plugins.uglify() )
                .pipe( plugins.rename({
                    suffix: '.min'
                }))
                .pipe( gulp.dest(dest) )
                ;

            return mergeStream( compile, minify );
        }

        return compile;
    }

    return mergeStream.apply( gulp, _.map(config.concatjs, concatJs) );
}

gulp.task( 'concatjs:dev', () => {
    return concatJsTask();
});

gulp.task( 'concatjs:prod', () => {
    return concatJsTask( true );
});

// export the task so that we can re-use it in other parts
export default concatJsTask;



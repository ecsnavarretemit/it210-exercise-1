/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Gulp Tasks Configuration File
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */
'use strict';

import path from 'path';

// make sure this is the web application root
let cwd = path.resolve( process.cwd() );

export let config = {
    browserSync: {
        proxy: 'it-210-exercise-1.lkexi.dev',
        port: 3000,
        open: 'local',
        timestamps: true,
        injectChanges: true,
        notify: true,
        reloadDelay: 0,
        files: [
            cwd + '/www/**/*.html'
        ]
    },

    clean: {
        all: [
            'www/compiled',
            'www/fonts/bootstrap',
            'www/fonts/font-awesome'
        ]
    },

    concatjs: [
        {
            src: [
                'resources/dependencies/jquery/dist/jquery.js',
                'resources/dependencies/bootstrap-sass/assets/javascripts/bootstrap.js',
            ],
            dest: 'www/compiled/js',
            outputName: 'lib-bundle.js',
            sourcemaps: true,
        }
    ],

    copyfonts: [
        {
            src: 'resources/dependencies/bootstrap-sass/assets/fonts/bootstrap/**/*',
            dest: 'www/fonts/bootstrap'
        },
        {
            src: 'resources/dependencies/font-awesome/fonts/**/*',
            dest: 'www/fonts/font-awesome'
        }
    ],

    es6: {
        bundleConfigs: [
            {
                entries: 'resources/js/site/main.js',
                dest: 'www/compiled/js',
                outputName: 'site.js',
                basedir: cwd,
                paths: [
                    cwd + '/resources'
                ]
            }
        ]
    },

    sass: [
        {
            src: 'resources/sass/default/main.sass',
            dest: 'www/compiled/css',
            sourcemaps: true,
            sassOptions: {
                outputStyle: 'expanded',
                includePaths: [
                    './resources/dependencies',
                    './resources/lib'
                ]
            }
        }
    ]
};

export const PID_FILE = cwd + '/tmp/gulp.pid';

export const TASKS_ENABLED = [
    'clean:all',
    ['concatjs:dev', 'sass:dev', 'es6:dev', 'copyfonts'],
    'sass:watch',
    'browser-sync',
    'configuration:watch'
];

export const PROJECT_ROOT = cwd;



/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Watcher
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import _ from 'lodash';
import watch from 'gulp-watch';

export default class Watcher {

    constructor(watchPaths, options = {}, callback = _.noop) {
        this.id      = Math.random().toString( 36 ).substring( 10 );
        this.watcher = watch( watchPaths, options, callback );
    }

    getId() {
        return this.id;
    }

    getWatcher() {
        return this.watcher;
    }

}



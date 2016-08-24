/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Watchify Watcher
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

export default class WatchifyWatcher {

    constructor(watcher) {
        this.id      = Math.random().toString( 36 ).substring( 10 );
        this.watcher = watcher;
    }

    getId() {
        return this.id;
    }

    getWatcher() {
        return this.watcher;
    }

}



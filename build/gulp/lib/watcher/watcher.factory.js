/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * Watcher Factory
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */
'use strict';

import _ from 'lodash';
import Watcher from './watcher';
import './watcher.cleaner';

let WatcherFactory = {
    collection: new Map(),
    ids: [],

    add: function(watcher) {
        let id = watcher.getId();

        // add the watcher to the collection
        this.collection.set( id, watcher );

        // add the watcher id to list of ids being monitored
        this.ids.push( id );

        // return the watcher id.
        return id;
    },

    count: function() {
        return this.getAll().length;
    },

    close: function(id) {
        // close the watcher that has the id provided
        if ( this.collection.has(id) ) {
            this.collection.get( id ).getWatcher().close();
        }
    },

    closeAll: function() {
        let existing = _.reject( this.getAll(), _.isUndefined );

        // close all existing watchers
        if ( existing.length > 0 ) {
            // invoke close on each watcher.
            _.each( existing, (v) => { v.getWatcher().close(); } );

            // set the ids array to empty since we closed all the watchers.
            this.ids = [];
        }
    },

    create: function(watchPaths, options = {}, callback = _.noop) {
        let watcher = new Watcher( watchPaths, options, callback );

        return this.add( watcher );
    },

    get: function(id) {
        return this.collection.get( id );
    },

    getAll: function() {
        if ( this.ids.length === 0 ) {
            return [];
        }

        // fetch all the watchers in the collection
        return _.map( this.ids, (v) => { return this.collection.get( v ); } );
    }
};

export default WatcherFactory;



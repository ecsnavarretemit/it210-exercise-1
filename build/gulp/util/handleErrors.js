/*jshint node:true, esnext: true, undef:true, unused: true*/

/*!
 * handleErrors
 * 
 * Copyright(c) Exequiel Ceasar Navarrete <development.lkexi@gmail.com>
 * Licensed under MIT
 */
'use strict';

import notify from 'gulp-notify';

let handleErrors = function() {
    var args = Array.prototype.slice.call( arguments );

    // Send error to notification center with gulp-notify
    notify
        .onError( {
            title: "Compile Error",
            message: "<%= error %>"
        })
        .apply( this, args )
        ;

    // Keep gulp from hanging on this task
    this.emit( 'end' );
};

export default handleErrors;



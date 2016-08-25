/*jshint browser:true, esversion:6, jquery:true, unused:true, undef:true, multistr:true*/

/*!
 * Site JavaScript
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import jQuery from 'jquery';
import lodash from 'lodash';

jQuery( window ).on( 'load', () => {
    'use strict';

    // [Globals] ::start
    let $ = window.jQuery;
    // [Globals] ::end

    // [Global Elements] ::start
    let browserWindow = $( window );
    let editorBody    = $( '.editor__body' );
    let editorTabs    = editorBody.children( '.editor__tabs' );
    let editorContent = editorBody.find( '.main-content .tab-content' );
    // [Global Elements] ::end

    // [Fix content height] ::start
    {
        let contentHeight = browserWindow.height() - editorTabs.outerHeight();

        editorContent.height( contentHeight );
    }
    // [Fix content height] ::end

});

jQuery( document ).ready(($) => {
    'use strict';

    // [Global Elements] ::start
    // let browserWindow = $( window );
    let editorBody     = $( '.editor__body' );
    let editorTabs     = editorBody.children( '.editor__tabs' );
    let sidebar        = $( '.editor__sidebar' );
    let openedFiles    = sidebar.find( '.sidebar__group--opened-files' );
    let availableFiles = sidebar.find( '.sidebar__group--available-files' );
    // [Global Elements] ::end

    // [Templates] ::start
    let templates = {
        tab: lodash.template(
            `<li class="nav-tabs__item nav-tabs__item--<%= data.target %>" role="presentation" >
                  <a href="#<%= data.target %>" aria-controls="<%= data.target %>" role="tab" data-toggle="tab">
                      <span class="nav-tabs__item__text"><%- data.target_normalized %></span>
                      <i class="fa fa-times nav-tabs__item__icon" aria-hidden="true"></i>
                  </a>
              </li>`, {
                  variable: 'data'
              })
    };
    // [Templates] ::end

    let helpers = {
        getAssociatedItemByHref (href) {
            return availableFiles
                .find( '.link' )
                .filter( `[href="${href}"]` )
                .parent( '.list__item' )
                ;
        },

        openTab (href) {
            // let panes = editorBody.find( '.main-content .tab-pane' );

            let el = editorTabs
                .find( '.nav-tabs .nav-tabs__item a' )
                .filter( `[href="${href}"]` )
                ;

            // console.log( panes.filter('.active') );

            // hide current open tab
            // panes
            //     .filter( '.active' )
            //     .removeClass( 'active' )
            //     ;

            if ( el.length > 0 ) {
                // panes
                //     .filter( href )
                //     .addClass( 'active' )
                //     ;

                el.tab( 'show' );
            }

            return el;
        }
    };

    availableFiles
        .children( '.list' )
        .on( 'click.openFile.appendOnOpenList', '.list__item .link', function(e) {
            let anchor   = $( this );
            let item     = anchor.parent( '.list__item' );
            let isOpened = item.data( 'openedfile' );

            // prevent default browser behavior
            e.preventDefault();

            if ( item.length > 0 && !isOpened ) {
                let clone = item.clone();

                // remove any copied data
                clone.removeData( 'openedfile' );

                // switch the icon before appending
                clone
                    .find( '.link__icon' )
                    .removeClass( 'fa-file-text' )
                    .addClass( 'fa-times' )
                    ;

                // append the cloned and modified element to the list of opened files
                openedFiles.children( '.list' ).append( clone );

                // set the opened data to true so that it will prevent
                // appending to the list multiple times
                item.data( 'openedfile', true );
            }
        })
        .on( 'click.openFile.appendOnTabs', '.list__item .link', function(e) {
            let anchor   = $( this );
            let item     = anchor.parent( '.list__item' );
            let isOpened = item.data( 'openedtab' );
            let href     = anchor.attr( 'href' );
            let text     = anchor.find( '.link__text' ).text();

            // prevent default browser behavior
            e.preventDefault();

            if ( item.length > 0 && !isOpened ) {
                let compiled = templates.tab( {
                    target: href.substring( 1 ),
                    target_normalized: text
                });

                // append the compiled template
                editorTabs.children( '.nav-tabs' ).append( compiled );

                // set the opened data to true so that it will prevent
                // appending to the list multiple times
                item.data( 'openedtab', true );
            }
        })
        .on( 'click.openFile.showTab', '.list__item .link', function() {
            // show the tab on open
            helpers.openTab( $(this).attr("href") );
        })
        ;

    openedFiles
        .children( '.list' )
        .on( 'click.prevent', '.list__item .link', function(e) {
            // prevent default browser behavior
            e.preventDefault();
        })
        .on( 'click.closeFile', '.list__item .link__icon', function(e) {
            let anchor = $( this ).parent( '.link' );
            let item   = anchor.parent( '.list__item' );

            // prevent default browser behavior
            e.preventDefault();

            let associatedItem = helpers.getAssociatedItemByHref( anchor.attr("href") );

            if ( associatedItem.length > 0 ) {
                let isTabOpen = associatedItem.data( 'openedtab' );

                // set the opened data to false to allow opening of files again
                associatedItem.data( 'openedfile', false );

                // trigger the close tab event on the corresponding tab.
                if ( isTabOpen ) {
                    editorTabs
                        .children( '.nav-tabs' )
                        .find( 'a' )
                        .filter( `[href="${anchor.attr("href")}"]` )
                        .children( '.nav-tabs__item__icon' )
                        .trigger( 'click.closeFile' )
                        ;
                }
            }

            // remove the item from the list of opened files
            item.remove();
        })
        ;

    editorTabs
        .children( '.nav-tabs' )
        .on( 'click.prevent', '.nav-tabs__item a', function(e) {
            // prevent default browser behavior
            e.preventDefault();
        })
        .on( 'click.closeFile', '.nav-tabs__item .nav-tabs__item__icon', function() {
            let anchor = $( this ).parent( 'a' );
            let item   = anchor.parent( '.nav-tabs__item' );

            let associatedItem = helpers.getAssociatedItemByHref( anchor.attr("href") );

            if ( associatedItem.length > 0 ) {
                let isFileOpen = associatedItem.data( 'openedfile' );

                // set the opened data to false to allow opening of files again
                associatedItem.data( 'openedtab', false );

                // trigger the close tab event on the corresponding tab.
                if ( isFileOpen ) {
                    openedFiles
                        .children( '.list' )
                        .find( '.link' )
                        .filter( `[href="${anchor.attr("href")}"]` )
                        .children( '.link__icon' )
                        .trigger( 'click.closeFile' )
                        ;
                }
            }

            // get the index of the tab and subtract 1 to open the tab before it
            let anchorTabs = editorTabs.find( '.nav-tabs .nav-tabs__item a' );
            let prevIdx    = anchorTabs.index( anchor ) - 1;

            // if the index to be opened it negative,
            // then reset it to 0 to open the very first tab.
            if ( prevIdx < 0 ) {
                prevIdx = 0;
            }

            // remove the item from the opened tabs
            item.remove();

            // open the tab that preceded by the removed tab
            helpers.openTab( anchorTabs.eq(prevIdx).attr('href') );
        })
        ;


});



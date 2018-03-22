
/* IMPORT */

import * as _ from 'lodash';
import {abstract} from './abstract';
import config from '../config';
import Utils from '../utils';

/* RSS */

class rss extends abstract {

  /* HELPERS */

  _getExtension () {

    return '.rss';

  }

  /* RENDER */

  renderPrefix () {

    this.rendered += `\
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
`;

  }

  renderSuffix () {

    this.rendered += `
</feed>
`;

  }

  renderFeed ( ) {

    if ( !_.includes(config.report.fullPath, 'group') && !_.includes(config.report.fullPath, 'feed') ) {
      this.rendered += `
  <title>Feed</title>
  <link rel="self" href="${this._getPublicPath ()}"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>${this._getPublicPath ()}</id>
`;
    }

    Utils.feed.walk ( 
    
      this.feeds,
      
      _.noop,
      
      [
        ( group, cnf ) => {
          if (_.includes(config.report.fullPath, 'group') && !_.includes(config.report.fullPath, 'feed')) {
            this.rendered = '';
            this.renderPrefix ();
            this.rendered += `
  <title>Feed of ${group.name}</title>
  <link rel="self" href="${this._getPublicPath ( { group: group.name } )}"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>${this._getPublicPath ( { group: group.name } )}</id>
`;
          }
        },
        ( group, cnf ) => {
          if (_.includes(config.report.fullPath, 'group') && !_.includes(config.report.fullPath, 'feed')) {
            this.renderSuffix ();
            this.save( this._getSavePath ( { group: group.name } ) );
            this.rendered = '';
          }
        }
      ],
      
      ( feed, cnf, depth, group ) => {

        if ( cnf.filter && !cnf.filter ( this.tokensAll[cnf.url], this.tokensAllOld[cnf.url], this.tokensAll ) ) return;

        const template = this._getTemplate ( cnf, 'rss', 'txt' ),
            lines = this._parseTemplate ( template, this.tokensAll[cnf.url], this.tokensAllOld[cnf.url], this.tokensAll );

        if (_.includes(config.report.fullPath, 'feed')) {
          this.rendered = '';
          this.renderPrefix ();
          this.rendered += `
  <title>Feed of ${feed.name} (${group.name})</title>
  <link rel="self" href="${this._getPublicPath ( { group: group.name, feed: feed.name } )}"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>${this._getPublicPath ( { group: group.name, feed: feed.name } )}</id>
`;
          this.renderLines ( lines );
          this.renderSuffix ();
          this.save ( this._getSavePath ( { group: group.name, feed: feed.name } ) );
          this.rendered = '';

        } else {

          this.renderLines ( lines );

        }

      }

    );

  }

  renderLines ( lines ) {

    lines.forEach ( line => this.renderLine ( line ) );

  }

  renderLine ( line = '' ) {

    this.rendered += `${line}`;

  }

  render () {

    this.rendered = '';

    if ( !_.includes(config.report.fullPath, 'group') && !_.includes(config.report.fullPath, 'feed') ) {
      this.renderPrefix ();
    }
  
    this.renderFeed ();

    if ( !_.includes(config.report.fullPath, 'group') && !_.includes(config.report.fullPath, 'feed') ) {
      this.renderSuffix ();
    }

  }

  /* API */

  async run ( save: boolean = config.report.save, open: boolean = config.report.open ) {

    return super.run ( save, open );

  }

}

/* EXPORT */

export {rss};

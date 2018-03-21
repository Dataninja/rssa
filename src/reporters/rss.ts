
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

  renderFeed () {

    this.rendered += `
  <title>Example feed</title>
  <link rel="self" href="http://fakedomain.com/rss"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>http://fakedomain.com/rss</id>
`;

    Utils.feed.walk ( this.feeds, _.noop, ( group, config ) => {

      //this.renderLine ( group.name, 'h4' );

    }, ( feed, config ) => {

      if ( config.filter && !config.filter ( this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll ) ) return;

      const template = this._getTemplate ( config, 'rss', 'txt' ),
            lines = this._parseTemplate ( template, this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll );

      this.renderLines ( lines );

    });

  }

  renderLines ( lines ) {

    lines.forEach ( line => this.renderLine ( line ) );

  }

  renderLine ( line = '' ) {

    this.rendered += `${line}`.replace(/ \& /g," &amp; ");

  }

  render () {

    this.rendered = '';

    this.renderPrefix ();
    this.renderFeed ();
    this.renderSuffix ();

  }

  /* API */

  async run ( save: boolean = config.report.save, open: boolean = true ) {

    return super.run ( save, open );

  }

}

/* EXPORT */

export {rss};


/* IMPORT */

import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import Fetch from './fetch';
import History from './history';

/* EXTRACT */

const Extract = {

  async page ( options ) {

    const {url, tokens, headless} = options,
          page = await Fetch.do ( url, headless ),
          history = await History.read (),
          last = History.getLast ( history, url ),
          $ = cheerio['load'] ( page );

    return Extract.tokens ( page, $, tokens, last && last['tokens'] );

  },

  tokens ( page, $, tokens, oldTokens ) {

    return _.transform ( tokens, ( acc, value, key ) => {

      acc[key] = Extract.token ( page, $, value, oldTokens && oldTokens[key] );

    }, {} );

  },

  token ( page, $, options, oldToken ) {

    const extractor = _.isArray ( options ) ? options[0] : options,
          callback = _.isArray ( options ) ? options[1] : _.identity;

    let value;

    if ( _.isRegExp ( extractor ) ) {

      const parts = page.match ( extractor );

      value = parts ? parts[1] : null;

    } else if ( _.isString ( extractor ) ) {

      value = $( extractor ).text ();

    } else if ( _.isFunction ( extractor ) ) {

      value = extractor ( page, $, oldToken );

    } else {

      throw new Error ( 'Unsupported extractor' );

    }

    return callback ( value );

  }

};

/* EXPORT */

export default Extract;


/* IMPORT */

import * as _ from 'lodash';
import {argv} from 'yargs';
import * as path from 'path';
import Utils from './utils';

/* CONFIG */

let config = Utils.require.json ( path.join ( __dirname, '../../config.json' ) );

if ( argv.config ) {

  config = _.merge ( config, Utils.require.json ( argv.config ) );
  config.report.fullPath = path.join ( config.report.path, config.report.name );

}

/* EXPORT */

export default config;

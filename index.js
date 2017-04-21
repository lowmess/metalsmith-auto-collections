const debug = require('debug')('metalsmith-auto-collections')
const collections = require('metalsmith-collections')
const mm = require('micromatch')
const path = require('path')

const auto_collect = opts => {
  // get the pattern from the config, or default to all files
  opts.pattern = opts.pattern || []
  // get options to pass to metalsmith-collections
  opts.settings = opts.settings || {}

  return (files, metalsmith, done) => {
    setImmediate(done)

    // initialize a container for all the collections
    // we use this so we can apply the settings for each collection
    // when we call metalsmith-collections
    const config = {}

    Object.keys(files).forEach(file => {
      if (mm(file, opts.pattern).length) {
        let parent = path.dirname(file)
        // set parent to source file in config if file is in root
        parent = parent === '.' ? metalsmith._source : parent
        // add collection key to file metadata
        // don't overwrite collection if exists
        let collection = files[file].collection || parent
        // create new key if it doesn't exist
        if (!config[collection]) config[collection] = opts.settings
        // set the file metadata
        files[file].collection = collection
        debug(`${file} added to "${parent}" collection`)
      }
    })

    debug(`metalsmith-collections configuration: ${config}`)

    // call metalsmith-collections
    collections(config)(files, metalsmith, done)
  }
}

module.exports = auto_collect

const debug = require('debug')('metalsmith-auto-collections')
const collections = require('metalsmith-collections')
const mm = require('micromatch')
const path = require('path')

const auto_collect = opts => {
  // set opts to empty object if no options are passed
  // we do this so that attempting to call opts.key doesn't error
  // if the key does not exist
  opts = opts || {}
  // get the pattern from the config, or default to all files
  opts.pattern = opts.pattern || '**'
  // get options to pass to metalsmith-collections
  opts.settings = opts.settings || {}
  // get optional manual collections
  opts.manual = opts.manual || {}

  return (files, metalsmith, done) => {
    setImmediate(done)

    // initialize a container for all the collections
    // we use this so we can apply the settings for each collection
    // when we call metalsmith-collections
    const config = {}

    // Add non-automatic collections to config.
    Object.keys(opts.manual).forEach(collection => {
      if (!config[collection]) config[collection] = opts.manual[collection]
    })

    Object.keys(files).forEach(file => {
      if (mm(file, opts.pattern).length) {
        // get name of parent directory
        let parent = path
          .dirname(file)
          .split(path.sep)
          .pop()

        // set parent to source file in config if file is in root
        parent = parent === '.' ? metalsmith._source : parent

        // set parent key on file
        files[file].parent =
          files[file].parent ||
          path.join(metalsmith._source, path.dirname(file))

        // add collection key to file metadata
        // don't overwrite collection if exists
        const collection = files[file].collection || parent

        // create new key in metalsmith-collections config if it doesn't exist
        if (!config[collection]) config[collection] = opts.settings

        // set the file metadata
        files[file].collection = collection
        debug(`${file} added to "${collection}" collection`)
      }
    })

    // call metalsmith-collections
    debug(`metalsmith-collections configuration: ${config}`)
    collections(config)(files, metalsmith, done)
  }
}

module.exports = auto_collect

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
  opts.collections = opts.collections || {}

  return (files, metalsmith, done) => {
    setImmediate(done)

    // initialize a container for all the collections
    // we use this so we can apply the settings for each collection
    // when we call metalsmith-collections
    const config = {}

    // Add non-automatic collections to config
    Object.keys(opts.collections).forEach(collection => {
      if (!config[collection]) config[collection] = opts.collections[collection]
    })

    Object.keys(files).forEach(file => {
      if (mm(file, opts.pattern).length) {
        // get name of parent directory
        let parent = path.dirname(file).split(path.sep).pop()

        // set parent to source file in config if file is in root
        parent = parent === '.' ? metalsmith._source : parent

        // set parent key on file
        files[file].parent =
          files[file].parent ||
          path.join(metalsmith._source, path.dirname(file))

        // create new key in metalsmith-collections config if it doesn't exist
        if (!config[parent]) config[parent] = opts.settings

        // extend the file metadata, filtering out falsy collections
        files[file].collection = [files[file].collection, parent].filter(c => c)

        debug(`${file} added to "${parent}" collection`)
      }
    })

    // call metalsmith-collections
    debug(`metalsmith-collections configuration: ${config}`)
    collections(config)(files, metalsmith, done)
  }
}

module.exports = auto_collect

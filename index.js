const path = require('path')
const debug = require('debug')('metalsmith-auto-collections')
const msCollections = require('metalsmith-collections')
const mm = require('micromatch')

const auto_collect = ({ pattern = '**', settings = {}, collections = {} }) => {
  return (files, metalsmith, done) => {
    setImmediate(done)

    // initialize a container for all the collections
    // we use this so we can apply the settings for each collection
    // when we call metalsmith-collections
    const config = {}

    // Add non-automatic collections to config
    Object.keys(collections).forEach((collection) => {
      if (!config[collection]) config[collection] = collections[collection]
    })

    Object.keys(files).forEach((file) => {
      if (mm(file, pattern).length) {
        // get name of parent directory
        let parent = path.dirname(file).split(path.sep).pop()

        // set parent to source file in config if file is in root
        parent = parent === '.' ? metalsmith._source : parent

        // set parent key on file
        files[file].parent =
          files[file].parent ||
          path.join(metalsmith._source, path.dirname(file))

        // create new key in metalsmith-collections config if it doesn't exist
        if (!config[parent]) config[parent] = settings

        // extend the file metadata, filtering out falsy collection names
        files[file].collection = [files[file].collection, parent].filter(
          (c) => c
        )

        debug(`${file} added to "${parent}" collection`)
      }
    })

    // call metalsmith-collections
    debug(`metalsmith-collections configuration: ${config}`)
    msCollections(config)(files, metalsmith, done)
  }
}

module.exports = auto_collect

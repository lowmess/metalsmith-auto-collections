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
    Object.keys(files).forEach(file => {
      if (mm(file, opts.pattern).length) {
        let parent = path.dirname(file)
        // set parent to source file in config if file is in root
        parent = parent === '.' ? metalsmith._source : parent
        // don't overwrite collection if exists
        if (!files[file].collection) {
          files[file].collection = parent
          debug(`${file} added to "${parent}" collection`)
        }
      }
    })

    // call metalsmith-collections
    metalsmith.use(collections(opts.settings))
  }
}

module.exports = auto_collect

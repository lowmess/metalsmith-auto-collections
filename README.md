# `metalsmith-auto-collections`

Automatically use `metalsmith-collections`. The collection name is equal to the parent directory of each file.

## Installation

```sh
yarn add metalsmith-auto-collections [-D]
```

## Usage

```js
const collect = require('metalsmith-auto-collections')

// add all files to a collection
metalsmith.use(collect())

// use globs to only set certain files to a collection
metalsmith.use(collect({
  pattern: ['**/*.md', '!*.md']
}))

// pass settings to `metalsmith-collections`
metalsmith.use(collect({
  pattern: '**/*.md',
  settings: {
    sortBy: 'date',
    reverse: true
  }
}))
```

 To see the available options, see the [`metalsmith-collections` repo](https://github.com/segmentio/metalsmith-collections).

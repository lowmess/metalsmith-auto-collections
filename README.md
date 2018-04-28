# `metalsmith-auto-collections`

Automatically use `metalsmith-collections`. The collection name is equal to the parent directory of each file.

## Installation

```sh
yarn add metalsmith-auto-collections [-D]
```

## Usage

```js
const Metalsmith = require('metalsmith')
const collect = require('metalsmith-auto-collections')

const ms = Metalsmith(__dirname)

// add all files to a collection
ms.use(collect())

// use globs to only set certain files to a collection
ms.use(collect({
  pattern: ['**/*.md', '!*.md']
}))

// pass settings to `metalsmith-collections`
ms.use(collect({
  pattern: '**/*.md',
  settings: {
    sortBy: 'date',
    reverse: true
  }
}))

// additionally add collections manually (won't be overwritten by automatically added collections)
ms.use(collect({
  manualCollections: {
    foo: {
      pattern: 'foo/*.md',
      sortBy: 'date'
    },
    bar: {
      pattern: 'bar.md'
    }
  },
  pattern: '**/*.md'
}))
```

 To see the available options, see the [`metalsmith-collections` repo](https://github.com/segmentio/metalsmith-collections).

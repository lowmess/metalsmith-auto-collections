# DEPRECATED

It is suggested you use the [`@metalsmith/collections`](https://www.npmjs.com/package/@metalsmith/collections) plugin directly. While there is (at time of writing) no way to automatically generate collections by directory, doing so manually is simple:

```js
metalsmith.use(collections({
  blog: 'blog/*',
  features: 'features/*',
})
```

# `metalsmith-auto-collections`

Automatically use `metalsmith-collections`. The collection name is equal to the parent directory of each file.

## Installation

```sh
npm install metalsmith-auto-collections [-D]
```

## Usage

```js
const Metalsmith = require('metalsmith')
const collect = require('metalsmith-auto-collections')

const ms = Metalsmith(__dirname)

// add all files to a collection
ms.use(collect())

// use globs to only set certain files to a collection
ms.use(
  collect({
    pattern: ['**/*.md', '!*.md'],
  })
)

// pass settings to `metalsmith-collections`
ms.use(
  collect({
    pattern: '**/*.md',
    settings: {
      sortBy: 'date',
      reverse: true,
    },
  })
)

// pass collections to metalsmith-collections (for manual collections)
ms.use(
  collect({
    collections: {
      navigation: {
        sortBy: 'ordering',
      },
    },
  })
)
```

To see the available options, see the [`metalsmith-collections` repo](https://github.com/segmentio/metalsmith-collections).

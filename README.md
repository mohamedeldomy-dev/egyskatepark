# egyskatepark

Before publishing, run:

```
node scripts/check-site.cjs
node --test scripts/navigation.test.cjs
```

The root and English homepage must stay identical. Publish changes to both;
do not reconnect an older root bundle. Every HTML entry loads the same
`navigation.js` and `navigation.css` before app hydration. In-page navigation
must have one owner: do not add scroll retries, smooth-scroll loops or a second
home-component hash handler. Version changed app bundles with new filenames
instead of changing existing immutable files. The GitHub workflow checks these
invariants on pushes and pull requests; it does not run scheduled tasks.

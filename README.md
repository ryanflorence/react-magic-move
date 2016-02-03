React Magic Move
================

Magic Move for React.JS

NOT A PRODUCTION MODULE
-----------------------

This was just a fun experiment, with some love, it could definitely be a real
thing, but I don't have time. I will merge pull requests to keep it working,
but I don't maintain this right now.

Usage
-----

1. Wrap some ordered elements in `<MagicMove/>`
2. Add a key to each element
3. Add some CSS transitions and border-box sizing (so the code can
   measure it more easily)

```css
.Something {
  transition: all 500ms ease;
  box-sizing: border-box;
}
```

```js
<MagicMove>
  {this.sortedElementsWithKeys(this.state.sortBy)}
</MagicMove>
```

Running Example
---------------
```
npm install
scripts/dev-examples
```

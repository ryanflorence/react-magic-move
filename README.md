React Magic Move
================

Magic Move for React.JS

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


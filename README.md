# Clip-path converter

The converter is just preparing SVG path to be used in CSS clip-path.

If we'll take a path from editor or ordinary SVG icon, it'll have absolute coordinates and [will not be stretched](https://codepen.io/yoksel/pen/QWWWRqv). There are some [funny](https://twitter.com/AlaricBaraou/status/1180958279570280448) [hacks](https://twitter.com/paullebeau/status/1181169153287155712) to solve this problem, but I think, it will be easier to translate coordinates from absolute to relative and just use path.

Read about clip-path:

* [Clip-path on MDN](https://developer.mozilla.org/ru/docs/Web/CSS/clip-path)
* [Clipping, Clipping, and More Clipping!](https://css-tricks.com/clipping-clipping-and-more-clipping/)
* [Animating with Clip-Path](https://css-tricks.com/animating-with-clip-path/)
* [and more...](https://css-tricks.com/tag/clip-path/)

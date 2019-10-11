# Clip-path converter

The converter is just preparing SVG path to be used in CSS clip-path.

If we'll take a path from editor or ordinary SVG icon, it'll have absolute coordinates and will not be stretched. There are some funny hacks to solve this problem, but I think, it will be easier to translate coordinates from absolute to relative and just use path.

Read more about clip-path:

* [Clipping, Clipping, and More Clipping!](https://css-tricks.com/clipping-clipping-and-more-clipping/)
* [Animating with Clip-Path](https://css-tricks.com/animating-with-clip-path/)
* [and more...](https://css-tricks.com/tag/clip-path/)

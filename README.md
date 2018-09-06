# Parallax

This document is an explainer for a potential future web platform feature
enabling parallax elements.

## Sample code

```html
<parallax-container>
  <parallax-something rate="0.3">
    <img src="header.png">
  </parallax-something>

  <p>Site content continues</p>
</parallax-container>
```

## Motivation

Having all of the contents of your page scroll at the same rate makes it appear
very flat. Initially, fixed position backgrounds allowed having the content
scroll independently past it. However, user interfaces have since started
employing the use of parallax to create the appearance of 3d depth instead of
either having content fixed or scrolling at full speed.

When this technique was brought to the web, it was implemented using script
to position the parallaxing element in response to scroll updates. This worked
reasonably well when scroll events were synchronous but every browser now
implements asynchronous scrolling to ensure that scrolling remains smooth even
when the page slows down. This means that often script positioned parallax will
jitter when the browser is unable to service the script for every rendered
frame.

Browser vendors have only recently started trying to define a specification
which would make it possible to declaratively specify your parallax effect but
there are many technical challenges that have made this a problem. However, it
is possible to implement parallax in the browser's asynchronous scrolling today
by combining 3d perspective and sticky positioning. This is very unergonomic,
which is exactly the sort of case that layered APIs can solve!

## Implementation

Parallax can be implemented in two ways, both of which make use of transforms:

* Using perspective on the scrolling element to cause the shift in the scrolled
  parallax element to not be as great as the scrolled content.

* Using sticky position with a transform (scale or perspective) to make the
  sticky position offset not actually shift the element as much as necessary to
  counteract the scroll.

The perspective implementation unfortunately doesn't work on mobile Safari with
the `webkit-overflow-scrolling: touch` property, and sticky position is not yet
implemented on the Edge browser. This means that using both approaches is
necessary to achieve support on all major browsers.

## API Surface

The simplest API surface supporting both of the implementations requires adding
custom style to both the scrolling element and the element which is intended to
parallax.

## Variations and design considerations

* In some circumstances, it can be difficult to calculate the correct parallax
  rate, i.e. as seen in the performant parallax demo where a background image
  is made to perfectly fill a gap slightly larger than that image. We could
  define a gap we want the parallax to fill between two elements.

* In order be shifted by sticky positioning freely, the parallaxing elements
  need to be able to move by the scroll distance they must parallax over within
  their container, otherwise sticky position would constrain them. However,
  this container does not need to be the scroller. It may be nice to allow
  non top-level elements to parallax.

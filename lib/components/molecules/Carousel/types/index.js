// @flow
import type { Node } from 'react';

export type CarouselProps = {
  children: Node,
  slideTransitionTime?: Number,
  slideAnimationTime?: Number,
  autoplay?: Boolean,
  controls?: Boolean,
  dots: Boolean,
};

export type SlideWrapperProps = {
  children: Node,
  className?: String,
};

export type SlideProps = {
  children: Node,
  className?: String,
};

export type AnimationProps = {
  children?: Node,
  className?: String,
  renderPlay?: Function,
  renderPause?: Function,
};

export type NavControllerProps = {
  children?: Node,
  className?: String,
  type: String,
};

export type GetListProps = {
  renderSlideThumb?: Object,
};

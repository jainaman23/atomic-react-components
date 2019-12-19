// @flow
/**
 * Carousel
 */
import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import stylesCarousel from './Carousel.style';
import {
  CarouselProps,
  AnimationProps,
  GetListProps,
  SlideWrapperProps,
  SlideProps,
  NavControllerProps,
} from './types';
import List from '../List';
import Button from '../../atoms/Button';
import useInterval from '../../../hooks/SetInterval/useSetInterval.hook';

const CarouselContext = React.createContext([]);

/**
 * Rendering carousel dots
 *
 * @return HTML
 *   Wrapper with UL | OL
 */
const GetList = ({ btnStyle, renderSlideThumb }: GetListProps): Node => {
  const { activeSlideIndex, setSlideIndex, slides, config } = useContext(CarouselContext);
  const { itemsPerSlide } = config;
  const allSlides = [];

  for (let id = 0; id < Math.ceil(slides.length / itemsPerSlide); id += 1) {
    allSlides.push(
      <li key={id} className={classnames('item', { active: id === activeSlideIndex })}>
        <Button onClick={() => setSlideIndex(id)} className={classnames('icon', btnStyle)}>
          {(renderSlideThumb && renderSlideThumb[id]) || id + 1}
        </Button>
      </li>
    );
  }

  return allSlides;
};

/**
 * ListWrapper for dots.
 */
const ListWrapper = ({ ...props }) => {
  return (
    <div className="carousel-dots">
      <List>
        <GetList {...props} />
      </List>
    </div>
  );
};

/**
 * Provides HTML for navigation button.
 *
 * @param {Object} navType
 *   type of navigation controller.
 */
const NavController = ({ navType, children, prevLabel, nextLabel }: NavControllerProps): Node => {
  const { setSlideIndex, activeSlideIndex, slides } = useContext(CarouselContext);

  const handleNavController = type => {
    setSlideIndex(type === 'next' ? activeSlideIndex + 1 : activeSlideIndex - 1);
  };

  const handleKeyPress = e => {
    if (e.key === 'ArrowRight') {
      handleNavController('next');
    } else if (e.key === 'ArrowLeft') {
      handleNavController('prev');
    }

    return null;
  };

  return (
    <div className={classnames('nav-action', navType)}>
      <Button
        onClick={() => handleNavController(navType)}
        onKeyUp={() => handleKeyPress}
        disabled={
          navType === 'next' ? activeSlideIndex === slides.length - 1 : activeSlideIndex === 0
        }
      >
        {children || (navType === 'next' ? nextLabel : prevLabel)}
      </Button>
    </div>
  );
};

/**
 * Carousel Controls.
 */
const CarouselControls = ({ ...props }) => {
  return (
    <div className="carousel-controls">
      <NavController navType="next" />
      <NavController navType="prev" />
      <AnimationControl {...props} />
    </div>
  );
};

/**
 * Play and Pause icon to handle slide animation.
 */
const AnimationControl = ({ className, renderPlay, renderPause }: AnimationProps): Node => {
  const { setAnimationRunning, isAnimationRunning } = useContext(CarouselContext);

  const handleAnimation = () => {
    setAnimationRunning(!isAnimationRunning);
  };

  return (
    <div className={classnames('animation-panel', className)}>
      <Button onClick={handleAnimation}>{isAnimationRunning ? renderPause() : renderPlay()}</Button>
    </div>
  );
};

/**
 * Carousel Main Element.
 *
 * @param {Element} children
 *   Wraps all tha carousel elements.
 *
 * @return Carousel.
 */
const Carousel = ({
  children,
  className,
  controls,
  autoplay,
  dots,
  legacy,
  slideTransitionTime,
  slideAnimationTime,
  renderSlideThumb,
  itemsPerSlide,
  responsive,
  ...others
}: CarouselProps): Node => {
  const [config, setConfig] = useState({
    controls,
    autoplay,
    dots,
    slideTransitionTime,
    slideAnimationTime,
    renderSlideThumb,
    itemsPerSlide,
  });
  const [activeSlideIndex, setSlideIndex] = useState(0);
  const [slides, setSlidesContent] = useState([]);
  const [isAnimationRunning, setAnimationRunning] = useState(config.autoplay);

  const getResponsiveConfiguration = responsiveConfig => {
    return responsiveConfig
      .filter(item => item.breakpoint < window.innerWidth)
      .reduce((initialConfig, currentConfig) => {
        return initialConfig.breakpoint > currentConfig.breakpoint ? initialConfig : currentConfig;
      });
  };

  useEffect(() => {
    if (responsive.length !== 0) {
      const configuration = getResponsiveConfiguration(responsive);
      if (configuration !== undefined) {
        const initialConfig = { ...config };
        Object.keys(configuration.settings).forEach(item => {
          initialConfig[item] = configuration.settings[item];
        });
        setConfig(initialConfig);
      }
    }
  }, []);

  useInterval(
    () => {
      const currentIndex = activeSlideIndex !== slides.length - 1 ? activeSlideIndex : -1;
      setSlideIndex(currentIndex + 1);
    },
    isAnimationRunning ? slideTransitionTime : null
  );

  const carouselState = {
    config,
    slides,
    activeSlideIndex,
    setSlideIndex,
    setSlidesContent,
    isAnimationRunning,
    setAnimationRunning,
  };

  return (
    <section className={classnames('carousel-wrapper', className, { legacy })} {...others}>
      <CarouselContext.Provider value={carouselState}>
        {children}
        {config.dots && <ListWrapper renderSlideThumb />}
        {config.controls && <CarouselControls />}
      </CarouselContext.Provider>
    </section>
  );
};

/**
 * Slide Wrapper.
 *
 * @param {Array} children
 *   Wraps all the slides.
 *
 * @return All slides in single wrapper.
 */
Carousel.SlideWrapper = ({ children, className, ...others }: SlideWrapperProps): Node => {
  const slidingWrapperRef = useRef();
  const {
    activeSlideIndex,
    isAnimationRunning,
    setAnimationRunning,
    setSlidesContent,
  } = useContext(CarouselContext);
  setSlidesContent(children);
  let currentAnimationStatus = true;

  const handleMouseEnter = () => {
    if (isAnimationRunning) {
      currentAnimationStatus = true;
      setAnimationRunning(!currentAnimationStatus);
    } else {
      currentAnimationStatus = false;
    }
  };

  const handleMouseLeave = () => {
    if (currentAnimationStatus) {
      currentAnimationStatus = false;
      setAnimationRunning(!currentAnimationStatus);
    }

    return null;
  };

  useEffect(() => {
    slidingWrapperRef.current.style.transform = `translateX(-${activeSlideIndex * 100}%)`;
  }, [activeSlideIndex]);

  return (
    <div
      className={classnames('carousel-section', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...others}
    >
      <div className={classnames('carousel-sliding-wrapper', className)} ref={slidingWrapperRef}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            id: index,
          });
        })}
      </div>
    </div>
  );
};

/**
 * Slide Container.
 *
 * @param {Element} children
 *   Will wraps the slide content.
 *
 * @return Single slide with wrapper.
 */
Carousel.Slide = ({ children, id, className }: SlideProps): Node => {
  const { activeSlideIndex, config } = useContext(CarouselContext);
  const { itemsPerSlide } = config;
  const slideRef = useRef();

  useEffect(() => {
    console.log(config, 'aa');
    slideRef.current.style.flexBasis = `${100 / itemsPerSlide}%`;
  }, [itemsPerSlide]);

  return (
    <div
      className={classnames('slide', { active: id === activeSlideIndex }, className)}
      ref={slideRef}
    >
      {children}
    </div>
  );
};

/**
 * Dots Navigation.
 *
 * @param {Element} children
 *   Will wraps the slide content.
 *
 * @return Single slide with wrapper.
 */
Carousel.Dots = ({ ...props }): Node => {
  return <ListWrapper {...props} />;
};

/**
 * Next Navigation.
 */
Carousel.Next = ({ children, ...props }: NavControllerProps) => (
  <NavController navType="next" {...props}>
    {children}
  </NavController>
);

/**
 * Previous Navigation.
 */
Carousel.Prev = ({ children, ...props }: NavControllerProps) => (
  <NavController navType="prev" {...props}>
    {children}
  </NavController>
);

/**
 * Animation Play/Pause Button.
 */
Carousel.AnimationController = ({ ...props }) => <AnimationControl {...props} />;

/**
 * Carousel Controls
 */
Carousel.Controls = ({ ...props }) => <CarouselControls {...props} />;

NavController.defaultProps = {
  nextLabel: 'next',
  prevLabel: 'prev',
};

AnimationControl.defaultProps = {
  renderPlay: () => 'play',
  renderPause: () => 'pause',
};

Carousel.Dots.defaultProps = {
  thumbnails: [],
};

Carousel.defaultProps = {
  controls: false,
  autoplay: false,
  dots: true,
  slideTransitionTime: 2000,
  slideAnimationTime: 3000,
  itemsPerSlide: 1,
};

Carousel.Slide.displayName = 'Slide';
Carousel.Dots.displayName = 'Dots';

export default styled(Carousel)`
  ${stylesCarousel};
`;

export { Carousel as CarouselVanilla };

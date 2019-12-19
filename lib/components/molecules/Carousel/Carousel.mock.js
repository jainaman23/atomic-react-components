const defaultConfig = {
  title: 'Spotlight',
  slideTransitionTime: 2000,
  slideAnimationTime: 1000,
  responsive: [
    { breakpoint: '360', settings: { itemsPerSlide: '1' } },
    { breakpoint: '480', settings: { itemsPerSlide: '2' } },
    { breakpoint: '720', settings: { itemsPerSlide: '3' } },
    { breakpoint: '1280', settings: { itemsPerSlide: '3' } },
  ],
};

export default defaultConfig;

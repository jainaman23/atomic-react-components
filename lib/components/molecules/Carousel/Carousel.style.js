import { css, keyframes } from 'styled-components';

const fadeKeyFrame = keyframes`
  0% {opacity: 0;}
  100% {opacity: 100%;}
`;

export default css`
  display: flex;
  flex-direction: column;

  .carousel-section {
    display: flex;
    width: ${props => props.width};
    height: ${props => props.height};
  }

  .slide {
    flex: 0 0 100%;
    display: none;

    &.active {
      display: block;
    }
  }

  .carousel-dots {
    ul {
      display: flex;
      justify-content: center;
    }
  }

  .fade {
    .active {
      animation: ${fadeKeyFrame} ${props => props.slideAnimationTime / 1000}s linear;
    }
  }

  ${props => (props.inheritedStyles ? props.inheritedStyles : '')};
`;

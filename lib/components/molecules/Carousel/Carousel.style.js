import { css } from 'styled-components';

export default css`
  display: flex;
  flex-direction: column;

  .carousel-section {
    overflow: hidden;
  }
  ${props => console.log(props)}
  .carousel-sliding-wrapper {
    display: flex;
    flex-flow: row nowrap;
    transition: transform ${props => props.slideAnimationTime / 1000}s;
  }

  .slide {
    padding: ${props => props.theme.spacing.UNIT_1};
    flex-grow: 0;
    flex-shrink: 0;
  }

  .carousel-dots {
    ul {
      display: flex;
      justify-content: center;
    }
  }

  .dots {
    border-radius: 50%;
    text-indent: -1000px;
    overflow: hidden;
    width: 10px;
    height: 10px;
    padding: 0;
    min-height: initial;
    margin: ${props => props.theme.spacing.UNIT_1};
  }

  &.legacy {
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    .nav-action {
      flex: 0 0 30px;

      button {
        padding: 0;
        background-color: transparent;
      }
    }

    .carousel-section {
      overflow: hidden;
      flex: 0 0 calc(100% - 70px);
    }

    .carousel-dots {
      flex: 0 0 100%;
      margin: ${props => props.theme.spacing.UNIT_1};
    }
  }

  ${props => (props.inheritedStyles ? props.inheritedStyles : '')};
`;

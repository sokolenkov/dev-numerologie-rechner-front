import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/LightBoxDetailView.css';

import Panel from './Panel';
import Steps from './Steps';
import Step from './Step';

/**
 * lightbox style view to display texts and make
 * them navigateable
 */
class LightBoxDetailView extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      sectionName: PropTypes.string.isRequired,
      sectionElements: PropTypes.arrayOf(PropTypes.shape({
        elementTitle: PropTypes.string.isRequired,
        elementContent: PropTypes.string.isRequired,
      })),
    })).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    sectionIndex: PropTypes.number,
    elementIndex: PropTypes.number,
  };

  static defaultProps = {
    sectionIndex: 0,
    elementIndex: 0,
  };

  /**
   * default constructor
   */
  constructor(props) {
    super(props);

    // initializing state based on props passed from server
    this.state = {
      currentSectionIndex: props.sectionIndex,
      currentElementIndex: props.elementIndex,
    };
  }

  /**
   * lifcycle method called if props change
   * @param nextProps new version of the props
   */
  componentWillReceiveProps(nextProps) {
    // checking if own state needs ro be re-initilized based on props
    // from parent component
    if (
      this.state.currentSectionIndex !== nextProps.sectionIndex ||
      this.state.currentElementIndex !== nextProps.elementIndex
    ) {
      this.setState({
        currentSectionIndex: nextProps.sectionIndex,
        currentElementIndex: nextProps.elementIndex,
      });
    }
  }

  /**
   * lifecylce method
   */
  componentDidUpdate() {
    // updating body class of the site to prevent scrolling
    document.body.classList.toggle('noScroll', this.props.isOpen);

    // if modal is shown, getting forcus so key inputs work
    if (this.props.isOpen) {
      this.self.focus();
    }
  }

  /**
   * handles next click in the tour component
   */
  handleNextClick = () => {
    if (
      this.state.currentElementIndex <
      this.props.data[this.state.currentSectionIndex].sectionElements.length - 1
    ) {
      this.setState({
        currentElementIndex: this.state.currentElementIndex + 1,
      });
    } else if (this.state.currentSectionIndex < this.props.data.length - 1) {
      this.setState({
        currentSectionIndex: this.state.currentSectionIndex + 1,
        currentElementIndex: 0,
      });
    }
  };

  /**
   * handles back click in the tour component
   */
  handleBackClick = () => {
    if (this.state.currentElementIndex > 0) {
      this.setState({
        currentElementIndex: this.state.currentElementIndex - 1,
      });
    } else if (this.state.currentSectionIndex > 0) {
      this.setState({
        currentSectionIndex: this.state.currentSectionIndex - 1,
        currentElementIndex:
          this.props.data[this.state.currentSectionIndex - 1].sectionElements
            .length - 1,
      });
    }
  };

  /**
   * handle method for key strokes
   * @param event the key down event
   */
  handleKeyDown = (event) => {
    switch (event.key) {
      // determining which key was pressed
      case 'ArrowRight':
        this.handleNextClick();
        return;
      case 'ArrowLeft':
        this.handleBackClick();
        break;
      case 'Escape':
        this.props.onClose();
        break;
      default:
    }
  };

  /**
   * default render
   */
  render() {
    // if detail view not open -> not showing it
    if (this.props.isOpen === false) {
      return null;
    }

    // getting current element
    const currentElement = this.props.data[this.state.currentSectionIndex]
      .sectionElements[this.state.currentElementIndex];

    return (
      <div
        className="LightBoxDetailView__Container modal-backdrop"
        onKeyDown={this.handleKeyDown}
        role="link"
        tabIndex="0"
        ref={(root) => {
          this.self = root;
        }}
      >
        <div className="LightBoxDetailView__ContentOverview">
          <Steps horizontal>
            {this.props.data.map((item, index) => {
              // getting length of current section
              const currentSectionLength = item.sectionElements.length;

              // determining index to display for step
              let stepElementIndex = 0;
              if (index === this.state.currentSectionIndex) {
                stepElementIndex = this.state.currentElementIndex;
              } else if (index < this.state.currentSectionIndex) {
                stepElementIndex = currentSectionLength - 1;
              }

              // determining the name of the item to display
              // if if is the current section, an indication for
              // the element position in the current section is given
              let stepName = item.sectionName;
              if (index === this.state.currentSectionIndex) {
                stepName += ` (${stepElementIndex +
                  1}/${currentSectionLength})`;
              }

              return (
                <Step
                  key={item.sectionName}
                  name={stepName}
                  current={index === this.state.currentSectionIndex}
                  done={index < this.state.currentSectionIndex}
                  horizontal
                />
              );
            })}
          </Steps>
        </div>
        <div className="LightBoxDetailView__Content">
          <div className="LightBoxDetailView__ButtonArea">
            <button
              className="LightBoxDetailView__NavigationButton"
              onClick={this.handleBackClick}
            >
              <i className="icon wb-chevron-left" />
            </button>
          </div>
          <div className="col-10">
            <Panel
              className="LightBoxDetailView__Panel"
              title={currentElement.elementTitle}
            >
              {currentElement.elementContent}
            </Panel>
          </div>
          <div className="LightBoxDetailView__ButtonArea">
            <button
              className="LightBoxDetailView__NavigationButton"
              onClick={this.handleNextClick}
            >
              <i className="icon wb-chevron-right" />
            </button>
          </div>
        </div>
        <div className="LightBoxDetailView__BottomActions">
          <button className="btn btn-default" onClick={this.props.onClose}>
            {' '}
            Schließen{' '}
          </button>
        </div>
      </div>
    );
  }
}

export default LightBoxDetailView;

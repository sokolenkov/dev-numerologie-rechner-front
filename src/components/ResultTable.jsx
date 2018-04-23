import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ResultTableRow from './ResultTableRow';
import '../styles/ResultTable.css';

/**
 * table capable of rendering calculation and number results
 * returned from the server
 */
class ResultTable extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dataKey: PropTypes.string.isRequired,
    handleTextDetailClick: PropTypes.func.isRequired,
  };

  handleTextDetailClick = (index) => {
    this.props.handleTextDetailClick(this.props.dataKey, index);
  };

  /**
   * renders the heading of the table
   */
  renderHeadings() {
    // if comparison => render compare headers
    if (this.props.dataCompare) {
      return this.renderCompareHeadings();
    }
    // determining last header element to align properly
    const lastIndex = this.props.data.headings.length - 1;
    return (
      <thead>
        <tr>
          {this.props.data.headings.map((heading, index) => {
            // setting style based on index
            let headingStyleClass = '';
            if (index === 0) {
              headingStyleClass += 'tableRow__name';
            } else if (index === lastIndex) {
              headingStyleClass += 'tableRow__text';
            }

            return (
              <th
                key={heading || this.props.data.name + index}
                className={headingStyleClass}
              >
                {heading}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }

  renderCompareHeadings() {
    if (this.props.data.numbers.length < 1) {
      return null;
    }

    // getting compare headers
    const compareIndices = this.props.data.numbers[0].compareIndices;

    // filtering given headers
    const filteredHeaderData = this.props.data.headings.filter((item, index) =>
      compareIndices.includes(index));

    const filteredHeaderCompareData = this.props.dataCompare.headings.filter((item, index) => compareIndices.includes(index));
    filteredHeaderCompareData.shift();

    const headers = filteredHeaderData.concat(filteredHeaderCompareData);

    // rendering headers
    return (
      <thead>
        <tr>
          {headers.map((heading, index) => (
            <th
              className={index === 0 ? 'tableRow__name' : ''}
              key={heading || this.props.data.name + index}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  /**
   * default render method rendering content objects based on their type
   */
  render() {
    return [
      <table
        key={`ResultTable ${this.props.data.name}`}
        className="ResultTable table table-striped ResultTable--non-selectable ResultTable--non-printable"
      >
        {this.props.data.headings && this.renderHeadings()}
        <tbody>
          {this.props.data.numbers.map((item, index) => (
            <ResultTableRow
              key={`ResultTableRow ${item.id}`}
              item={item}
              compareItem={
                this.props.dataCompare
                  ? this.props.dataCompare.numbers[index]
                  : null
              }
              rowIndex={index}
              onTextDetailClick={this.handleTextDetailClick}
            />
          ))}
        </tbody>
      </table>,
      <h3 className="ResultTable--printWatermark" key="watermark">
        Die Resultate können nur mit Druckpaket ausgedruckt werden.
      </h3>,
    ];
  }
}

export default ResultTable;

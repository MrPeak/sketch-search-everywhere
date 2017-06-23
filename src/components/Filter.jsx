"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Select, Switch, Radio, Tooltip } from "antd";
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import "./Filter.less";

class Filter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const children = [];
    const classDictionary = [
      "ShapeGroup",
      "BitmapLayer",
      "TextLayer",
      "SymbolInstance",
      "ArtboardGroup",
      "LayerGroup"
    ];

    classDictionary.forEach((_class, i) => {
      children.push(
        <Option key={i.toString(36) + i} value={_class}>{_class}</Option>
      );
    });

    console.log(5413)

    return (
      <div>
        <RadioGroup defaultValue="stringValue" size="small" onChange={this.props.onChangeSearchType}>
          <RadioButton value="name">By Name</RadioButton>
          <RadioButton value="stringValue" disabled={this.props.filters.layerClass !== 'TextLayer'}>By Text</RadioButton>
          <RadioButton value="objectID">By Id</RadioButton>
        </RadioGroup>

        <Select
          style={{ width: 120, float: "right" }}
          size="small"
          defaultValue="TextLayer"
          placeholder="Filter className"
          dropdownStyle={{ maxHeight: 52, overflow: 'scroll' }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0}
          onChange={this.props.onFilterClassType}
          disabled={this.props.filters.type === 'stringValue'}
        >
          {children}
        </Select>
      </div>
    );
  }
}

export default Filter;

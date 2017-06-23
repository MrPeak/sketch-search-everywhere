"use strict";

import React from "react";
import ReactDOM, { findDOMNode } from "react-dom";
import { LocaleProvider, Select, Row, Col } from "antd";
import enUS from "antd/lib/locale-provider/en_US";
import Filter from "./Filter.jsx";
const Option = Select.Option;

import "./App.less";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.isSelecting = false;
    this.query = "";
    this.state = {
      selectID: null,
      filters: {
        type: "stringValue",
        layerClass: "TextLayer"
      }
    };
  }

  componentDidMount() {
    this.el = findDOMNode(this.refs.searcher);
    this.el.querySelector(".ant-select-search__field").focus();
  }

  onChangeSearchType(ev) {
    const value = ev.target.value;
    console.log("onChangeSearchType", value);
    const filters = {
      type: value,
      layerClass: this.state.filters.layerClass
    };

    this._query(filters);
    this.setState({ filters });
  }

  onFilterClassType(value) {
    console.log("onFilterClassType", value);

    const filters = {
      type: this.state.filters.type,
      layerClass: value || ""
    };
    this._query(filters);
    this.setState({ filters });
  }

  renderList(value) {
    console.log('responseData:', value.length);
    let list = value.split("|||");

    list = list.map(el => {
      const obj = {};
      el.split(";").forEach(_el => {
        const item = _el.split(":");
        obj[item[0]] = item[1];
      });
      return obj;
    });

    this.isSelecting = false;
    const options = [];
    list.forEach((el, i) => {
      if (Object.keys(el).length && el.id) {
        const isTextLayer = el.class.toLowerCase().trim() == "mstextlayer";
        options.push(
          <Option value={el.id} key={i}>
            <Row style={{ textAlign: "center" }}>
              <Col title={decodeURIComponent(el.name)} span={6}>
                {decodeURIComponent(el.name)}
              </Col>

              {(() => {
                if (isTextLayer) {
                  return (
                    <Col span={6}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          margin: "0 auto",
                          border: "1px solid #e3e3e3",
                          background: el.color || "#fff"
                        }}
                      />
                    </Col>
                  );
                } else {
                  return <Col title={el.class} span={6}>{el.class}</Col>;
                }
              })()}

              <Col title={decodeURIComponent(el.parentName)} span={6}>
                {decodeURIComponent(el.parentName)}
              </Col>
              <Col span={6}>{el.parentClass}</Col>
            </Row>
          </Option>
        );
      }
    });

    if (options.length) {
      options.unshift(
        <Option disabled value="122" key="541">
          <Row style={{ textAlign: "center" }}>
            <Col span={6}>name</Col>
            <Col span={6}>
              {this.state.filters.layerClass.indexOf("TextLayer") > -1
                ? "color"
                : "class"}
            </Col>
            <Col span={6}>parent name</Col>
            <Col span={6}>parent class</Col>
          </Row>
        </Option>
      );
    }

    console.log(options);
    this.el.querySelector(".ant-select-search__field").focus();
    this.setState({ options });
  }

  onSelect(value) {
    // Send ObjectID to sketch plugin
    console.log("onSelect!");
    this.isSelecting = true;

    // send data
    window.location.hash = "@selectedLayerID=" + value;

    setTimeout(() => {
      this.isSelecting = false;
    }, 10);
  }

  onBlur() {
    console.log("onBlur!");
    // request
    window.location.hash = "@query=" + JSON.stringify({ value: "" });
  }

  onInput(value) {
    if (this.isSelecting) {
      console.log("onSelect?!");
      return false;
    }

    this.query = value;

    console.log("onInput!");

    this._query(this.state.filters);
  }
  _query(filters) {
    const data = {
      value: this.query,
      filters: filters,
      callback: "renderList"
    };

    console.log('queryParam:', data);
    // request
    window.location.hash = "@query=" + JSON.stringify(data);
  }
  render() {
    return (
      <LocaleProvider locale={enUS}>
        <div>
          <Filter
            onChangeSearchType={this.onChangeSearchType.bind(this)}
            onFilterClassType={this.onFilterClassType.bind(this)}
            filters={this.state.filters}
          />
          <Select
            ref="searcher"
            mode="combobox"
            size="large"
            className="searcher"
            onBlur={this.onBlur.bind(this)}
            style={{
              width: "100%"
            }}
            allowClear
            onSelect={this.onSelect.bind(this)}
            onChange={this.onInput.bind(this)}
            filterOption={false}
            placeholder="Just input it"
            dropdownClassName="results-container"
          >
            {this.state.options}
          </Select>

        </div>
      </LocaleProvider>
    );
  }
}

// exports to global
window.App = ReactDOM.render(<App />, document.getElementById("app-container"));

/*global chrome,browser*/
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { goTo } from "react-chrome-extension-router";
import Settings from "./Settings";
import "../App.css";
import Notifications from "./Notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";

class Welcome extends Component {
  state = {
    enabled: true,
  };

  componentDidMount = () => {
    chrome.storage.local.get(["storage"], (result) => {
      this.setState({
        enabled: true,
      });
    });
  };

  welcomePage = () => {
    return (
      <div className="text-center">
        <img
          src="/img/notification.png"
          alt="bg"
          className="welcome-image "
        ></img>
        <div>
          <h2>Enable notifications</h2>
          <p>
            -Input endpoint URL
          </p>
          <p>
            -Parameters?
          </p>
        </div>
        <div>
          <button class="btn btn-warning" onClick={() => goTo(Settings)}>
            <FontAwesomeIcon icon="globe" /> Settings
          </button>
        </div>
      </div>
    );
  };
  render() {
    return this.state.enabled ? this.welcomePage() : this.welcomePage();
  }
}

export default Welcome;

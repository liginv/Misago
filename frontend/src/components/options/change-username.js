import React from 'react';
import Avatar from 'misago/components/avatar'; // jshint ignore:line
import misago from 'misago/index';
import { dehydrate } from 'misago/reducers/username-history';
import ajax from 'misago/services/ajax';
import store from 'misago/services/store';
import * as random from 'misago/utils/random'; // jshint ignore:line

export class UsernameHistory extends React.Component {
  renderUserAvatar(item) {
    if (item.changed_by) {
      /* jshint ignore:start */
      return <a href={item.changed_by.absolute_url} className="user-avatar">
        <Avatar user={item.changed_by} size="100" />
      </a>;
      /* jshint ignore:end */
    } else {
      /* jshint ignore:start */
      return <span className="user-avatar">
        <Avatar size="100" />
      </span>;
      /* jshint ignore:end */
    }
  }

  renderUsername(item) {
    if (item.changed_by) {
      /* jshint ignore:start */
      return <a href={item.changed_by.absolute_url} className="item-title">
        {item.changed_by.username}
      </a>;
      /* jshint ignore:end */
    } else {
      /* jshint ignore:start */
      return <span className="item-title">
        {item.changed_by_username}
      </span>;
      /* jshint ignore:end */
    }
  }

  renderHistory() {
    /* jshint ignore:start */
    return <div className="username-history ui-ready">
      <ul className="list-group">
        {this.props.changes.map((item, i) => {
          return <li className="list-group-item" key={i}>
            <div className="username-change-avatar">
              {this.renderUserAvatar(item)}
            </div>
            <div className="username-change-author">
              {this.renderUsername(item)}
            </div>
            <div className="username-change">
              {item.old_username}
              <span className="material-icon">
                arrow_forward
              </span>
              {item.new_username}
            </div>
            <div className="username-change-date">
              <abbr title={item.changed_on.format('LLL')}>
                {item.changed_on.fromNow()}
              </abbr>
            </div>
          </li>;
        })}
      </ul>
    </div>;
    /* jshint ignore:end */
  }

  renderEmptyHistory() {
    /* jshint ignore:start */
    return <div className="username-history ui-ready">
      <ul className="list-group">
        <li className="list-group-item empty-message">
          {gettext("No name changes have been recorded for your account.")}
        </li>
      </ul>
    </div>;
    /* jshint ignore:end */
  }

  renderHistoryPreview() {
    /* jshint ignore:start */
    return <div className="username-history ui-preview">
      <ul className="list-group">
        {random.range(3, 5).map((i) => {
          return <li className="list-group-item" key={i}>
            <div className="username-change-avatar">
              <span className="user-avatar">
                <Avatar size="100" />
              </span>
            </div>
            <div className="username-change-author">
              <span className="ui-preview-text" style={{width: random.int(30, 100) + "px"}}>&nbsp;</span>
            </div>
            <div className="username-change">
              <span className="ui-preview-text" style={{width: random.int(30, 50) + "px"}}>&nbsp;</span>
              <span className="material-icon">
                arrow_forward
              </span>
              <span className="ui-preview-text" style={{width: random.int(30, 50) + "px"}}>&nbsp;</span>
            </div>
            <div className="username-change-date">
              <span className="ui-preview-text" style={{width: random.int(50, 100) + "px"}}>&nbsp;</span>
            </div>
          </li>
        })}
      </ul>
    </div>;
    /* jshint ignore:end */
  }

  render() {
    if (this.props.isLoaded) {
      if (this.props.changes.length) {
        return this.renderHistory();
      } else {
        return this.renderEmptyHistory();
      }
    } else {
      return this.renderHistoryPreview();
    }
  }
}

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      options: null
    };
  }

  componentDidMount() {
    Promise.all([
      ajax.get(this.props.user.api_url.username),
      ajax.get(misago.get('USERNAME_CHANGES_API'), {user: this.props.user.id})
    ]).then((data) => {
      this.setState({
        isLoaded: true,
        options: data[0]
      });

      store.dispatch(dehydrate(data[1].results));
    });
  }

  render() {
    /* jshint ignore:start */
    return <div>
      <UsernameHistory isLoaded={this.state.isLoaded}
                       changes={this.props['username-history']} />
    </div>
    /* jshint ignore:end */
  }
}
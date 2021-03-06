import React from 'react';
import ReactDOM from 'react-dom';
import { divide, forEach } from 'lodash';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from '@fortawesome/free-regular-svg-icons'


class ScheduleURL extends React.Component {
  constructor(props) {
    super(props);
    this.schedule_url = document.getElementById('schedule-url').dataset.url;
    
    this.container = document.getElementById('schedule-url');

    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  showMessage() {
    let messageParent = document.createElement('div');
    let message = document.createElement('p');
    messageParent.classList.add('text-container', 'mb-5');
    message.classList.add('message');
    message.textContent = 'You have copied URL.';

    this.container.appendChild(messageParent);
    messageParent.appendChild(message);

    setTimeout(() => {
      messageParent.removeChild(message);
      this.container.removeChild(messageParent);
    }, 2000);

  }

  copyToClipboard() {
    let dummy = document.createElement('textarea');

    dummy.textContent = this.schedule_url;

    document.body.appendChild(dummy);

    dummy.select();
    document.execCommand('copy');

    document.body.removeChild(dummy);

    this.showMessage();
  }

  render() {
    return (
      <div>
        <p>
          {'Schedule URL' + ' '}
          <FontAwesomeIcon className="copy-icon" icon={faCopy} onClick={this.copyToClipboard}/>
        </p>
        <p>{this.schedule_url}</p>
      </div>
    );
  }
}


class AvailabilitiesTable extends React.Component {

  constructor(props) {
    super(props);

    this.userNameTableHeader = this.userNameTableHeader.bind(this);
    this.availabilitiesTableData = this.availabilitiesTableData.bind(this);
    this.getAvailability = this.getAvailability.bind(this);
    this.userClick = this.props.userClick.bind(this);
  }

  userNameTableHeader() {
    const tableHeader = [];
    const availabilities = this.props.usersAvailabilities;

    this.props.users.forEach((user, i) => {
      tableHeader.push(<th key={user.userId} scope="col"><a className="users" data-id={user.userId} data-availabilities={availabilities[i]} href="#input-title" method="GET" onClick={this.userClick}>{user.userName}</a></th>);
    });

    return tableHeader;
  }

  getTableDataForCountAvailabilities(availabilitiesArray) {
    const tableData = [];
    for (let i = 0; i < 3; i++) {
      const count = availabilitiesArray.filter(x => x == i).length;
      tableData.push(<td key={'CA_' + i}>{count}</td>);
    }
    return tableData;
  }

  getAvailability(availabilities, i) {

    const tableData = [];

    // availabilitiesObj: [{userId: availability, userId: availability, ...}]
    const availabilitiesObj = availabilities[i];
    const availabilitiesArray = Object.values(availabilitiesObj);

    //<td>count 0</td><td>count 1</td><td>count 2</td>
    tableData.push(this.getTableDataForCountAvailabilities(availabilitiesArray));

    availabilitiesArray.forEach((availability, j) => {

      let symbol;

      switch (availability) {
        case '0':
          symbol = '○';
          break;
        case '1':
          symbol = '△';
          break;
        case '2':
          symbol = '×';
          break;
      }

      tableData.push(<td key={i + '_' + j}>{symbol}</td>);
    });

    return tableData;
  }

  availabilitiesTableData() {
    const tableData = [];
    const candidates = this.props.candidates;
    const availabilities = this.props.availabilities;

    candidates.forEach((candidate, i) => {
      tableData.push(<tr key={candidate + '_' + i} scope="row">
        <td>{candidate}</td>
        {this.getAvailability(availabilities, i)}
      </tr>);
    });

    return tableData;
  }

  render() {

    return (
    <div>
      <p className="mt-5">Schedule</p>
      <table className="table-bordered text-center">
        <thead>
          <tr>
          <th className="w-20">Date</th><th scope="col">○</th><th scope="col">△</th><th scope="col">×</th>
          {this.userNameTableHeader()}
          </tr>
        </thead>
        <tbody>
          {this.availabilitiesTableData()}
        </tbody>
      </table>
    </div>
    );
  }
}


class UserName extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.props.onChange;
  }

  render() {
    const userId = this.props.userId;
    const userName = this.props.userName;

    return (
      <div>
        <p>User Name</p>
        <input type="hidden" id="user-id" name="userId" value={userId}/>
        <input type="text" id="user-name" name="userName" value={userName} onChange={this.onChange} required />
      </div>
    );
  }
}


class Candidates extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.props.handleClick.bind(this);
  }

  render() {
    // const or let ??
    const candidates = this.props.candidates;
    return (
      <div>
        <p>Candidates</p>
        <table className="table-bordered text-center">
          <thead>
            <tr>
              <th className="w-40">Date</th><th className="w-20" scope="col"></th><th className="w-20" scope="col"></th><th className="w-20" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <TableRows onClick={this.handleClick} candidates={candidates}/>
          </tbody>
        </table>
      </div>
    );
  }
}

class TableRows extends React.Component {
  constructor(props) {
    super(props);
    this.candidates = this.props.candidates;
    this.handleClick = this.props.onClick.bind(this);
  }
  render() {

    const handleClick = this.handleClick;

    const rows = Array.prototype.map.call(this.candidates, function(candidate, index) {
      return <tr key={candidate.name} scope="row"><td>{candidate.dataset.date}</td><TableData onClick={handleClick} availability={candidate.value} rowIndex={index} /></tr>;
    });

    return rows;
  }
}

function TableData(props) {
  const handleClick = props.onClick;
  const rowIndex = props.rowIndex;
  const availability = props.availability;
  
  const symbols = ['○', '△', '×'];
  const tableData = symbols.map((symbol, symbolIndex) => {
    
    // availability is string...
    if (availability == symbolIndex) {

      return <td key={symbolIndex} onClick={() => handleClick(rowIndex, symbolIndex)} className="selected able">{symbol}</td>;
    } else {
      return <td key={symbolIndex} onClick={() => handleClick(rowIndex, symbolIndex)} className="able">{symbol}</td>;
    }
  });

  return tableData;
}


function AddButton(props) {
  const value = props.isAdd ? 'Add user' : 'Update user';
  return <input type="submit" id="submit-button" className="btn btn-outline-primary" name="add" value={value} />
}


function DeleteButton(props) {
  const hidden = props.isHidden ? ' display-none' : '';
  return <input type="submit" id="delete-button" className={"btn btn-outline-danger" + hidden} name="delete" value="Delete user" />
}


class ResetButton extends React.Component {

  constructor(props) {
    super(props);
    this.resetClick = this.props.onClick.bind(this);
  }

  render() {
    return <button type="button" id="reset-button" className="btn btn-outline-success w-100 mb-5" onClick={this.resetClick}>Reset input information</button>
  }
}


class UserAddForm extends React.Component {

  constructor(props) {
    super(props);

    const candidates = document.getElementsByClassName('candidates');

    // get data from laravel
    if (window.users.length) {
      this.users = window.users;
      this.usersAvailabilities = Object.values(window.usersAvailabilities);
    } else {
      this.users = [];
      this.usersAvailabilities = [];
    }
    this.candidatesDate = Object.values(window.candidates);
    this.availabilities = Object.values(window.availabilities);
    
    // initial input value = 0
    Array.prototype.map.call(candidates, candidate => {
      return candidate.value = 0;
    });

    this.state = {
      candidates: candidates,
      isHidden: true,
      isAdd: true,
      userId: '',
      userName: '',
    };


    this.handleClick = this.handleClick.bind(this);
    this.resetClick = this.resetClick.bind(this);
    this.onChangeUserName = this.onChangeUserName.bind(this);
    this.userClick = this.userClick.bind(this);
  }

  userClick(e) {
    const userId = e.target.dataset.id;
    const userName = e.target.innerHTML;
    
    const candidates = this.state.candidates;
    
    const usersAvailabilities = e.target.dataset.availabilities.split('_');

    Array.prototype.map.call(candidates, (candidate, i) => {
      return candidate.value = usersAvailabilities[i];
    });

    this.setState({
      candidates: candidates,
      isHidden: false,
      isAdd: false,
      userId: userId,
      userName: userName,
    });
  }

  resetClick(e) {
    const candidates = this.state.candidates;

    Array.prototype.map.call(candidates, candidate => {
      return candidate.value = 0;
    });
    
    this.setState({
      candidates: candidates,
      isHidden: true,
      isAdd: true,
      userId: '',
      userName: '',
    });
  }

  handleClick(rowIndex, symbolIndex) {
    const candidates = this.state.candidates;

    // update class .selected and input value
    candidates[rowIndex].value = symbolIndex;

    this.setState({
      candidates: candidates,
    });
  }

  onChangeUserName(e) {
    this.setState({
      userName: e.target.value
    });
  }

  render() {
    const candidates = this.state.candidates;

    return (
      <div>
        <ScheduleURL />
        <AvailabilitiesTable users={this.users} candidates={this.candidatesDate} availabilities={this.availabilities} usersAvailabilities={this.usersAvailabilities} userClick={this.userClick}/>
        <p className="mb-5" id="input-title">Input availabilities</p>
        <UserName userName={this.state.userName} userId={this.state.userId} onChange={this.onChangeUserName}/>
        <Candidates handleClick={this.handleClick} candidates={candidates}/>
        <AddButton isAdd={this.state.isAdd}/>
        <DeleteButton isHidden={this.state.isHidden} />
        <ResetButton onClick={this.resetClick} candidates={candidates}/>
      </div>
    );
  }
}


if (document.getElementById('add')) {
  ReactDOM.render(
  <UserAddForm />,
    document.getElementById('add')
  );
}
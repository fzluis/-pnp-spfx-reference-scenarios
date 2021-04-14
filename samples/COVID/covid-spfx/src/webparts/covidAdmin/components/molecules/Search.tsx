import * as React from "react";
import { Logger, LogLevel } from "@pnp/logging";
import { cloneDeep, find, isEmpty, isEqual } from "lodash";
import { cs } from "../../../../common/covid.service";
import DropDown, { IDropDownOption } from "../../../../common/components/atoms/DropDown";
import styles from "../CovidAdmin.module.scss";
import Button from "../../../../common/components/atoms/Button";
import { IQuery, Person, Query } from "../../../../common/covid.model";

export interface ISearchProps {
  //searchQuery: IQuery;
  search: (query: IQuery) => void;
  peopleOptions: IDropDownOption[];
}

export interface ISearchState {
  startDate: Date;
  endDate: Date;
  office: string;
  person: string | number;
  personName: string;
}

export class SearchState implements ISearchState {
  constructor(
    public startDate: Date = new Date(),
    public endDate: Date = new Date(),
    public office: string = null,
    public person: string | number = null,
    public personName: string = null,
  ) { }
}

export default class Search extends React.Component<ISearchProps, ISearchState> {
  private LOG_SOURCE: string = "🔶Search";
  private _locationOptions: IDropDownOption[] = [];

  constructor(props: ISearchProps) {
    super(props);
    this._locationOptions = cs.Locations.map((l) => { return { key: l.Title, text: l.Title }; });
    this._locationOptions.unshift({ key: "", text: "" });
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);
    this.state = new SearchState(startDate);

  }


  public shouldComponentUpdate(nextProps: ISearchProps, nextState: ISearchState) {
    if ((isEqual(nextState, this.state) && isEqual(nextProps, this.props)))
      return false;
    return true;
  }
  private _onDateChange = (fieldValue: string, fieldName: string) => {
    try {
      const stateObj = cloneDeep(this.state);
      const newDate = new Date(fieldValue);
      stateObj[fieldName] = newDate;
      this.setState(stateObj);
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_onDateChange) - ${err}`, LogLevel.Error);
    }
  }
  private _onDropDownChange = (fieldValue: string, fieldName: string) => {
    try {
      const stateObj = cloneDeep(this.state);
      stateObj[fieldName] = fieldValue;
      this.setState(stateObj);
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_onTextChange) - ${err}`, LogLevel.Error);
    }
  }
  private _onPeopleDropDownChange = (fieldValue: string, fieldName: string) => {
    try {
      const stateObj = cloneDeep(this.state);
      var employeeID = parseInt(fieldValue);
      if (employeeID) {
        const found = find(this.props.peopleOptions, { key: employeeID });
        if (found) {
          stateObj[fieldName] = found.text;
        }
      } else {
        stateObj[fieldName] = fieldValue;
      }

      this.setState(stateObj);
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_onTextChange) - ${err}`, LogLevel.Error);
    }
  }

  private _updateSearch() {

    let person: string | number;
    const found = find(this.props.peopleOptions, { text: this.state.personName });
    if (found) {
      var employeeID = parseInt(found.key.toString());
      if (employeeID) {
        person = found.key;
      } else {
        if (!isEmpty(found.text)) {
          person = found.text;
        } else {
          person = null;
        }

      }
    }

    let searchQuery: IQuery = new Query(
      this.state.startDate,
      this.state.endDate,
      this.state.office,
      person
    );
    this.props.search(searchQuery);

  }

  public render(): React.ReactElement<ISearchProps> {
    try {

      return (
        <div className={styles.searchControls}>
          <div >
            <div >Start Date</div>
            <input className="hoo-input-text" id="startDate" type="date" value={this.state.startDate.toISOString().substr(0, 10)} onChange={(newValue) => { this._onDateChange(newValue.target.value, "startDate"); }} />
          </div>
          <div >
            <div >End Date</div>
            <input className="hoo-input-text" id="endDate" type="date" value={this.state.endDate.toISOString().substr(0, 10)} onChange={(newValue) => { this._onDateChange(newValue.target.value, "endDate"); }} />
          </div>
          <div >
            <div >Office</div>
            <DropDown onChange={this._onDropDownChange} value={this.state.office} options={this._locationOptions} id="office" />
          </div>
          <div>
            <div >&nbsp;</div>
            <DropDown onChange={this._onPeopleDropDownChange} value={this.state.personName} options={this.props.peopleOptions} id="personName" />
          </div>
          <div>
            <div >&nbsp;</div>
            <Button className="hoo-button-primary" disabled={false} label="Search" onClick={() => this._updateSearch()} />
          </div>
        </div>

      );
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (render) - ${err}`, LogLevel.Error);
      return null;
    }
  }
}
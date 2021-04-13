import * as React from "react";
import { Logger, LogLevel } from "@pnp/logging";
import { isEqual, find, findIndex } from "lodash";
import { Icons } from "../../enums";

export enum DDState {
  "Initial",
  "Open",
  "Filtered",
  "Closed"
}

export enum Focus {
  "Input",
  "Forward",
  "Back"
}

export interface IDropDownOption {
  key: string | number;
  text: string;
}

export interface IDropDownProps {
  options: IDropDownOption[];
  id: string;
  value: string;
  onChange: (fieldValue: string, fieldName: string) => void;
}

export interface IDropDownState {
  ddState: DDState;
  open: boolean;
  optionsLength: number;
}

export class DropDownState implements IDropDownState {
  constructor(
    public optionsLength: number = 0,
    public ddState: DDState = DDState.Initial,
    public open: boolean = false
  ) { }
}

export default class DropDown extends React.Component<IDropDownProps, IDropDownState> {
  private LOG_SOURCE: string = "🔶DropDown";
  private _optionElements = [];
  private _inputElement: React.RefObject<HTMLInputElement>;

  constructor(props: IDropDownProps) {
    super(props);
    this.state = new DropDownState(props.options.length);
    this._inputElement = React.createRef<HTMLInputElement>();
  }

  public shouldComponentUpdate(nextProps: IDropDownProps, nextState: IDropDownState) {
    if ((isEqual(nextState, this.state) && isEqual(nextProps, this.props)))
      return false;
    return true;
  }

  private _onChange = (newValue: any, fieldName: string) => {
    try {
      this.props.onChange(newValue.value, fieldName);
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_onChange) - ${err}`, LogLevel.Error);
    }
  }

  private _toggleDropdown = () => {
    try {
      const focus = document.activeElement;
      let ddState = this.state.ddState;
      let open = this.state.open;
      switch (this.state.ddState) {
        case DDState.Initial:
          open = !open;
          ddState = DDState.Open;
          break;
        case DDState.Open:
          if (focus == this._inputElement.current) {
            open = false;
            ddState = DDState.Initial;
          } else if (focus.tagName == "LI") {
            this.props.onChange((focus as HTMLLIElement).dataset.value, this.props.id);
            open = false;
            ddState = DDState.Closed;
            this._moveFocus(document.activeElement, Focus.Input);
          }
          break;
        case DDState.Filtered:
          if (focus.tagName == "LI") {
            this.props.onChange((focus as HTMLLIElement).dataset.value, this.props.id);
            open = false;
            ddState = DDState.Closed;
            this._moveFocus(document.activeElement, Focus.Input);
          }
          break;
        case DDState.Closed:
          open = true;
          ddState = DDState.Open;
          break;
      }
      this.setState({ open: open, ddState: ddState });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_toggleDropdown) - ${err}`, LogLevel.Error);
    }
  }

  private _keyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focus = document.activeElement;
    const key = event.key;
    let ddState = this.state.ddState;
    let open = this.state.open;
    try {
      switch (key) {
        case 'Enter':
          if (this.state.ddState === DDState.Initial) {
            // if state = initial, toggleOpen and set state to opened
            open = true;
            ddState = DDState.Open;
          } else if (this.state.ddState === DDState.Open && focus.tagName === 'LI') {
            // if state = opened and focus on list, makeChoice and set state to closed
            this.props.onChange((focus as HTMLLIElement).dataset.value, this.props.id);
            open = false;
            ddState = DDState.Closed;
            this._moveFocus(document.activeElement, Focus.Input);
          } else if (this.state.ddState === DDState.Open && focus === this._inputElement.current) {
            // if state = opened and focus on input, close it
            open = false;
            ddState = DDState.Closed;
          } else if (this.state.ddState === DDState.Filtered && focus.tagName === 'LI') {
            // if state = filtered and focus on list, makeChoice and set state to closed
            this.props.onChange((focus as HTMLLIElement).dataset.value, this.props.id);
            open = false;
            ddState = DDState.Closed;
            this._moveFocus(document.activeElement, Focus.Input);
          } else if (this.state.ddState === DDState.Filtered && focus === this._inputElement.current) {
            // if state = filtered and focus on input, set state to opened
            open = true;
            ddState = DDState.Open;
          } else { // i.e. csState is closed, or csState is opened/filtered but other focus point?
            // if state = closed, set state to filtered? i.e. open but keep existing input? 
            open = true;
            ddState = DDState.Filtered;
          }
          break;
        case 'Escape':
          // if state = initial, do nothing
          // if state = opened or filtered, set state to initial
          // if state = closed, do nothing
          if (this.state.ddState === DDState.Open || this.state.ddState === DDState.Filtered) {
            open = false;
            ddState = DDState.Initial;
          }
          break;
        case 'ArrowDown':
          if (this.state.ddState === DDState.Initial || this.state.ddState === DDState.Closed) {
            // if state = initial or closed, set state to opened and moveFocus to first
            open = true;
            ddState = DDState.Open;
            this._moveFocus(this._inputElement.current, Focus.Forward);
          } else {
            // if state = opened and focus on input, moveFocus to first
            // if state = opened and focus on list, moveFocus to next/first
            // if state = filtered and focus on input, moveFocus to first
            // if state = filtered and focus on list, moveFocus to next/first
            open = true;
            this._moveFocus(document.activeElement, Focus.Forward);
          }
          break;
        case 'ArrowUp':
          if (this.state.ddState === DDState.Initial || this.state.ddState === DDState.Closed) {
            // if state = initial, set state to opened and moveFocus to last
            // if state = closed, set state to opened and moveFocus to last
            open = true;
            ddState = DDState.Open;
            this._moveFocus(this._inputElement.current, Focus.Back);
          } else {
            // if state = opened and focus on input, moveFocus to last
            // if state = opened and focus on list, moveFocus to prev/last
            // if state = filtered and focus on input, moveFocus to last
            // if state = filtered and focus on list, moveFocus to prev/last
            this._moveFocus(document.activeElement, Focus.Back);
          }
          break;
        default:
          if (this.state.ddState === DDState.Initial) {
            // if state = initial, toggle open, doFilter and set state to filtered
            open = true;
            ddState = DDState.Filtered;
            this._doFilter();
          } else if (this.state.ddState === DDState.Open) {
            // if state = opened, doFilter and set state to filtered
            ddState = DDState.Filtered;
            this._doFilter();
          } else if (this.state.ddState === DDState.Closed) {
            // if state = closed, doFilter and set state to filtered
            ddState = DDState.Filtered;
            this._doFilter();
          } else { // already filtered
            this._doFilter();
          }
          break;
      }
      this.setState({ open: open, ddState: ddState });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_keyUp) - ${err}`, LogLevel.Error);
    }
  }

  private _doFilter = () => {
    try {
      let optionsLength = this.state.optionsLength;
      let ddState = this.state.ddState;
      const terms = this._inputElement.current.value;
      const aFilteredOptions = this._optionElements.filter((option) => {
        if (option.innerText.toUpperCase().substring(0, terms.length) == (terms.toUpperCase())) {
          return true;
        }
      });
      this._optionElements.forEach(option => option.style.display = "none");
      aFilteredOptions.forEach((option) => {
        option.style.display = "";
      });
      ddState = DDState.Filtered;
      optionsLength = aFilteredOptions.length;
      this.setState({ ddState: ddState, optionsLength: optionsLength });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_doFilter) - ${err}`, LogLevel.Error);
    }
  }

  private _moveFocus = (fromHere: Element, toThere: Focus) => {
    try {
      // grab the currently showing options, which might have been filtered
      const aCurrentOptions = this._optionElements.filter((option) => {
        if (option.style.display === '') {
          return true;
        }
      });
      // don't move if all options have been filtered out
      if (aCurrentOptions.length === 0) {
        return;
      }
      if (toThere === Focus.Input) {
        this._inputElement.current.focus();
      }
      // possible start points
      switch (fromHere) {
        case this._inputElement.current:
          if (toThere === Focus.Forward) {
            aCurrentOptions[0].focus();
          } else if (toThere === Focus.Back) {
            aCurrentOptions[aCurrentOptions.length - 1].focus();
          }
          break;
        case this._optionElements[0]:
          if (toThere === Focus.Forward) {
            aCurrentOptions[1].focus();
          } else if (toThere === Focus.Back) {
            this._inputElement.current.focus();
          }
          break;
        case this._optionElements[this._optionElements.length - 1]:
          if (toThere === Focus.Forward) {
            aCurrentOptions[0].focus();
          } else if (toThere === Focus.Back) {
            aCurrentOptions[aCurrentOptions.length - 2].focus();
          }
          break;
        default: // middle list or filtered items 
          const currentItem = document.activeElement;
          const whichOne = findIndex(aCurrentOptions, (o) => { return o == (currentItem as HTMLLIElement); });
          if (toThere === Focus.Forward) {
            const nextOne = aCurrentOptions[whichOne + 1];
            nextOne.focus();
          } else if (toThere === Focus.Back && whichOne > 0) {
            const previousOne = aCurrentOptions[whichOne - 1];
            previousOne.focus();
          } else { // if whichOne = 0
            this._inputElement.current.focus();
          }
          break;
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_moveFocus) - ${err}`, LogLevel.Error);
    }
  }

  public render(): React.ReactElement<IDropDownProps> {
    try {
      return (
        <div data-component={this.LOG_SOURCE} className="hoo-select" role="combobox" aria-haspopup="listbox" aria-owns={`${this.props.id}-list`} onClick={this._toggleDropdown} onKeyUp={this._keyUp} >
          <div id={`${this.props.id}-status`} className="hidden-visually" aria-live="polite">
            {this.props.options.length} options available. Arrow down to browse or start typing to filter.
          </div>
          <input ref={this._inputElement} type="text" id={`${this.props.id}-input`} value={this.props.value} className="hoo-select-text" aria-autocomplete="both" aria-controls={`${this.props.id}-list`} />
          <button className="hoo-buttonicon" aria-label="">
            <div className="hoo-icon">
              <span className={`hoo-icon-svg ${Icons.DownArrow.Class}`} aria-hidden="true" dangerouslySetInnerHTML={{ "__html": Icons.DownArrow.SVG }} >
              </span>

            </div>
          </button>
          <ul
            role="listbox"
            className={`hoo-select-dropdown ${(this.state.open) ? "" : "hidden-all"}`}
            onChange={(newValue) => { this._onChange(newValue.target, this.props.id); }}>
            {this.props.options.map((o, index) => {
              return (<li ref={element => this._optionElements[index] = element} key={o.key} className="hoo-option" role="option" data-value={o.key} tabIndex={-1}>{o.text}</li>);
            })}
          </ul>
        </div>
      );
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (render) - ${err}`, LogLevel.Error);
      return null;
    }
  }
}
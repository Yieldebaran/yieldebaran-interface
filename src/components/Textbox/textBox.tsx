import React, { useEffect, useState } from 'react';
import './textBox.css';

interface Props {
  onClick: () => Promise<void> | void;
  validation: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  button?: string;
  symbol?: string;
  placeholder?: string;
  value: string;
  disabled: boolean;
  onChange?: () => void;
  buttonTooltip?: string;
  validationCollapse?: boolean;
  buttonDisabled?: boolean;
}

const TextBox: React.FC<Props> = (props: Props) => {
  const [focus, setFocus] = useState(false);
  const [placeHolder, setPlaceholder] = useState(props.placeholder);

  useEffect(() => {
    if (props.value.trim() === '' && !focus) setPlaceholder(props.placeholder);
  }, [props.value, focus, props.placeholder]);

  const onFocus = (): void => {
    setFocus(true);
    if (props.placeholder) {
      const temp = props.placeholder;
      setPlaceholder(temp.replace('0', '').trim());
    }
  };

  const onBlur = (): void => {
    setFocus(false);
    if (props.placeholder) {
      if (props.value.trim() === '') {
        setPlaceholder(props.placeholder);
      } else {
        const temp = props.placeholder;
        setPlaceholder(temp.replace('0', '').trim());
      }
    }
  };

  const buttonClick = (): void => {
    setFocus(true);
    if (props.placeholder) {
      const temp = props.placeholder;
      setPlaceholder(temp.replace('0', '').trim());
    }
    props.onClick();
  };

  const handleChange = (e: any): void => {
    if (props.onChange) props.onChange();
    let value: string = e.target.value.toString();
    if (value.startsWith('.')) value = '0' + value;
    props.setInput(value);
    if (props.placeholder) {
      const temp = props.placeholder;
      setPlaceholder(temp.replace('0', '').trim());
    }
  };

  const placeHolderClassName = `textbox-placeholder ${
    props.disabled && 'textbox-placeholder--disabled'
  } ${props.value.trim() && 'textbox-placeholder--up'}`;

  return (
    <div
      className={`textbox ${
        props.validation.trim() === '' && props.validationCollapse ? 'validation-collapse' : ''
      } ${props.disabled ? 'textbox-disabled' : ''}`}
    >
      <div className={props.button || props.symbol ? 'textbox-button' : ''}>
        <input
          type="text"
          disabled={props.disabled}
          required
          value={props.value}
          onChange={handleChange}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
        />
        <span data-tip={props.buttonTooltip} className={placeHolderClassName}>
          {placeHolder}
        </span>
        {props.button ? (
          props.buttonTooltip ? (
            <span
              data-tip={props.buttonTooltip}
              data-for="borrow-dialog-tooltip"
              className={`input-button ${
                props.disabled || props.buttonDisabled ? 'input-button-disabled' : ''
              }`}
              onClick={buttonClick}
            >
              {props.button}
            </span>
          ) : (
            <span
              className={`input-button ${
                props.disabled || props.buttonDisabled ? 'input-button-disabled' : ''
              }`}
              onClick={buttonClick}
            >
              {props.button}
            </span>
          )
        ) : (
          ''
        )}
        {props.symbol ? (
          <span className="input-button input-button-disabled">{props.symbol}</span>
        ) : (
          ''
        )}
      </div>
      <span className={'validation'}>{props.validation}</span>
    </div>
  );
};

export default TextBox;

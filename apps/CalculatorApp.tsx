import React, { useState } from 'react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, next: number, op: string): number => {
    switch (op) {
      case '/': return prev / next;
      case '*': return prev * next;
      case '+': return prev + next;
      case '-': return prev - next;
      default: return next;
    }
  };

  // Button Styles
  const btnBase = "h-14 rounded-full text-2xl font-medium transition-all active:scale-95 flex items-center justify-center select-none";
  const btnGray = `${btnBase} bg-[#505050] text-white hover:bg-[#606060]`;
  const btnLight = `${btnBase} bg-[#D4D4D2] text-black hover:bg-[#E0E0E0]`;
  const btnOrange = `${btnBase} bg-[#FF9F0A] text-white hover:bg-[#FFB030]`;
  const btnZero = `${btnBase} col-span-2 bg-[#505050] text-white hover:bg-[#606060] pl-6 justify-start`;

  return (
    <div className="h-full w-full bg-black flex flex-col p-4 select-none">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end mb-4 px-2">
        <div className="text-white text-5xl font-light truncate">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3">
        <button className={btnLight} onClick={clear}>{display === '0' && !prevValue ? 'AC' : 'C'}</button>
        <button className={btnLight} onClick={toggleSign}>±</button>
        <button className={btnLight} onClick={inputPercent}>%</button>
        <button className={`${btnOrange} ${operator === '/' ? 'bg-white text-[#FF9F0A]' : ''}`} onClick={() => performOperation('/')}>÷</button>

        <button className={btnGray} onClick={() => inputDigit('7')}>7</button>
        <button className={btnGray} onClick={() => inputDigit('8')}>8</button>
        <button className={btnGray} onClick={() => inputDigit('9')}>9</button>
        <button className={`${btnOrange} ${operator === '*' ? 'bg-white text-[#FF9F0A]' : ''}`} onClick={() => performOperation('*')}>×</button>

        <button className={btnGray} onClick={() => inputDigit('4')}>4</button>
        <button className={btnGray} onClick={() => inputDigit('5')}>5</button>
        <button className={btnGray} onClick={() => inputDigit('6')}>6</button>
        <button className={`${btnOrange} ${operator === '-' ? 'bg-white text-[#FF9F0A]' : ''}`} onClick={() => performOperation('-')}>−</button>

        <button className={btnGray} onClick={() => inputDigit('1')}>1</button>
        <button className={btnGray} onClick={() => inputDigit('2')}>2</button>
        <button className={btnGray} onClick={() => inputDigit('3')}>3</button>
        <button className={`${btnOrange} ${operator === '+' ? 'bg-white text-[#FF9F0A]' : ''}`} onClick={() => performOperation('+')}>+</button>

        <button className={btnZero} onClick={() => inputDigit('0')}>0</button>
        <button className={btnGray} onClick={inputDot}>.</button>
        <button className={btnOrange} onClick={() => performOperation('=')}>=</button>
      </div>
    </div>
  );
};

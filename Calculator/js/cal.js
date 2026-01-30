
const display = document.getElementById("display");
const operatorBox = document.getElementById("operatorBox");

let firstValue = "";
let operator = "";
let secondValue = "";

function updateDisplay(value) {
    display.textContent = value || "0";
}

function appendNumber(num) {
    if (operator === "") {
        if (num === "." && firstValue.includes(".")) return;
        firstValue += num;
        updateDisplay(firstValue);
    } else {
        if (num === "." && secondValue.includes(".")) return;
        secondValue += num;
        updateDisplay(secondValue);
    }
}

function setOperator(op) {
    if (firstValue === "") return;

    if (secondValue !== "") {
        calculate();
    }

    operator = op;
    operatorBox.textContent = op;
}

function calculate() {
    if (firstValue === "" || secondValue === "" || operator === "") return;

    let result;
    switch (operator) {
        case "+": result = +firstValue + +secondValue; break;
        case "-": result = firstValue - secondValue; break;
        case "*": result = firstValue * secondValue; break;
        case "/": result = secondValue == 0 ? "Error" : firstValue / secondValue; break;
    }

    updateDisplay(result);
    firstValue = result.toString();
    secondValue = "";
    operator = "";
    operatorBox.textContent = "";
}

function clearEntry() {
    if (operator === "") {
        firstValue = "";
        updateDisplay(firstValue);
    } else {
        secondValue = "";
        updateDisplay(secondValue);
    }
}

function allClear() {
    firstValue = "";
    secondValue = "";
    operator = "";
    operatorBox.textContent = "";
    updateDisplay(firstValue);
}


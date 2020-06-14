function leftPad(value, count = 2, char = '0') {
  let newValue = value.toString();

  if (value.toString().length < count) {
    for (let i = 0; i < count - value.toString().length; i++) {
      newValue = char + newValue;
    }
  }
  return newValue;
}

function getNewTimestamp() {
  const now = new Date();
  let result = '';

  result += leftPad(now.getDate());
  result += '/';
  result += leftPad(now.getMonth() + 1);
  result += '/';
  result += leftPad(now.getFullYear());
  result += ' ';
  result += leftPad(now.getHours());
  result += ':';
  result += leftPad(now.getMinutes());
  result += ':';
  result += leftPad(now.getSeconds());
  result += ':';
  result += leftPad(now.getMilliseconds());

  return result;
}

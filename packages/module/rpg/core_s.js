module.exports.showAlert = (player, style, message) => {
  let data = [style, message];
  console.log(JSON.stringify(data));
  player.call("showAlert", [JSON.stringify(data)]);
};

module.exports.showTimeoutBox = (player, style, message, time) => {
  let data = [style, message, time];
  console.log(JSON.stringify(data));
  player.call("showTimeoutBox", [JSON.stringify(data)]);
};

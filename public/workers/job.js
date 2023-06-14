self.onmessage = (event) => {
  console.log("onmessage",event)
  // Some heavy calculation or function here
  //const result = event.data[0] * event.data[1]; // just an example
  self.postMessage(1808);
};

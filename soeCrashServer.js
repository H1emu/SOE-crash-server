const Net = require("net");
const fs = require("fs");
const port = 4750;

const server = new Net.Server();
server.listen(port, function () {
  console.log(
    `Crash server is listening for connection requests on localhost:${port}`
  );
});

server.on("connection", function (socket) {
  console.log(
    `A new connection has been established from ${socket.remoteAddress}:${socket.remotePort}`
  );
  let crashLogBin = "";
  let crashLogString = "";
  socket.on("data", function (chunk) {
    chunk.forEach((e) => {
      crashLogBin += e;
    });
    crashLogString += chunk;
    console.log(`Data received from client: ${chunk}`);
  });

  socket.on("end", function () {
    console.log("Closing connection with the client");
    const crashLogName = `crashLog-${Date.now()}`;
    fs.writeFileSync(`${crashLogName}.bin`, crashLogBin);
    console.log(`${crashLogName}.bin created`);
    fs.writeFileSync(`${crashLogName}.txt`, crashLogString);
    console.log(`${crashLogName}.txt created`);
  });

  socket.on("error", function (err) {
    console.log(`Error: ${err}`);
  });
});

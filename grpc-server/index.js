const cluster = require("cluster");
const runGrpcServer = require("./grpcServer");
const numCPUs = 8; // max 12 on my machine

if (cluster.isMaster) {
  // Fork processes
  for (let i = 0; i < numCPUs; i++) {
    // give each process a unique port
    const port = `3004${i}`;
    cluster.fork({
      PORT: port,
    });
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log("worker " + worker.process.pid + " died");
  });
} else {
  // In child process
  runGrpcServer();
}

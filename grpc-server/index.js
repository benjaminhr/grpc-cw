const cluster = require("cluster");
const numCPUs = 8; // max 12 on my machine

if (cluster.isMaster) {
  // Fork processes
  for (let i = 0; i < numCPUs; i++) {
    const port = `3004${i}`; // give each process a unique port
    cluster.fork({
      PORT: port,
    });
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log("worker " + worker.process.pid + " died");
  });
} else {
  runGrpcServer();
}

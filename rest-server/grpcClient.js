const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { performance } = require("perf_hooks");
const utils = require("../utils/tools");
const blockMult = require("../utils/blockmult");
const PROTO_PATH = "blockmult.proto";

//  Load grpc definition file and create client server
const definition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const BlockMultService = grpc.loadPackageDefinition(definition)
  .BlockMultService;

// Function which creates an instance of the grpc client
// for every available instance (8)
function createGrpcClient(i) {
  // Ports ranging from 30040-30047
  const port = process.env.PORT || `3004${i}`;
  const host = process.env.HOST || "0.0.0.0";
  const address = `${host}:${port}`;
  const client = new BlockMultService(
    address,
    grpc.credentials.createInsecure()
  );

  return client;
}

const constants = {
  // deadline in ms
  deadline: 50,

  // -1 footprint (ms) means it has not been set yet
  footprint: -1,

  // 8 multiplyBlock calls + 4 addBlock calls
  numberOfCalls: 12,

  // Keep track of all clients, have one always ready for the initial call
  clients: [{ client: createGrpcClient(0), id: 0 }],

  // Index used to distribute clients evenly
  clientIndex: 0,
};

// Function for calculating and creating the number of clients needed
function scale() {
  let numberOfClients = Math.ceil(
    (constants.footprint * constants.numberOfCalls) /
      Math.abs(constants.deadline - constants.footprint)
  );

  console.log("footprint: " + constants.footprint);

  // Cap at 8 clients
  if (numberOfClients > 8) {
    numberOfClients = 8;
  }

  console.log("Scaling to: " + numberOfClients);

  for (let i = 1; i < numberOfClients; i++) {
    constants.clients[i] = {
      id: i,
      client: createGrpcClient(i),
    };
  }
}

// Returns the next available client
function getClient() {
  // Our load balancing strategy is just a counter which wraps around the length of the clients
  const client = constants.clients[constants.clientIndex];
  constants.clientIndex = ++constants.clientIndex % constants.clients.length;

  if (!client) {
    console.log("Could not find an available client.");
    process.exit(1);
  }

  return client;
}

// Resets footprint and clients after a matrix has been fully
// calculated and returned to the client
function resetGrpcClient() {
  constants.footprint = -1;
  constants.clientIndex = 0;

  // Close all activate connections
  for (const clientObj of constants.clients) {
    clientObj.client.close();
  }

  constants.clients = [{ client: createGrpcClient(0), id: 0 }];
}

// Wrapper function which creates protobuf acceptable block
// data structure, and then calls grpc multiplyBlock function
async function multiplyBlockRPC(A, B, MAX) {
  // Get the next available client
  const client = await getClient();

  console.log("Using client: " + (client.id + 1));

  return new Promise((resolve, reject) => {
    const block = utils.createBlock(A, B, MAX);
    const footPrintTimer1 = performance.now();

    client.client.multiplyBlock(block, (err, res) => {
      if (err) reject(err);

      // Set and measure footprint during first call, and scale up accordingly
      if (constants.footprint === -1) {
        constants.footprint = performance.now() - footPrintTimer1;
        scale();
      }

      const matrix = utils.convertProtoBufToArray(res.block);
      resolve(matrix);
    });
  });
}

// Wrapper function which creates protobuf acceptable block
// data structure, and then calls grpc addBlock function
async function addBlockRPC(A, B, MAX) {
  // Get the next available client
  const client = await getClient();

  console.log("Using client: " + (client.id + 1));

  return new Promise((resolve, reject) => {
    const block = utils.createBlock(A, B, MAX);

    client.client.addBlock(block, (err, res) => {
      if (err) reject(err);
      // Make client available again
      client.isAvailable = true;

      const matrix = utils.convertProtoBufToArray(res.block);
      resolve(matrix);
    });
  });
}

module.exports = {
  addBlockRPC,
  multiplyBlockRPC,
  resetGrpcClient,
};

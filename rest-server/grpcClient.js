const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const utils = require("../utils/tools");
const blockMult = require("../utils/blockmult");
const PROTO_PATH = "blockmult.proto";

/*
  Load grpc definition file and create client server
*/
const definition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const BlockMultService = grpc.loadPackageDefinition(definition)
  .BlockMultService;

const port = process.env.PORT || 30043;
const host = process.env.HOST || "0.0.0.0";
const address = `${host}:${port}`;
const client = new BlockMultService(address, grpc.credentials.createInsecure());

/*
  Wrapper function which creates protobuf acceptable block
  data structure, and then calls grpc multiplyBlock function
*/
async function multiplyBlockRPC(A, B, MAX) {
  return new Promise((resolve, reject) => {
    const block = utils.createBlock(A, B, MAX);

    client.multiplyBlock(block, (err, res) => {
      if (err) reject(err);

      const matrix = utils.convertProtoBufToArray(res.block);
      resolve(matrix);
    });
  });
}

/*
  Wrapper function which creates protobuf acceptable block
  data structure, and then calls grpc addBlock function 
*/
async function addBlockRPC(A, B, MAX) {
  return new Promise((resolve, reject) => {
    const block = utils.createBlock(A, B, MAX);

    client.addBlock(block, (err, res) => {
      if (err) reject(err);

      const matrix = utils.convertProtoBufToArray(res.block);
      resolve(matrix);
    });
  });
}

module.exports = {
  addBlockRPC,
  multiplyBlockRPC,
};

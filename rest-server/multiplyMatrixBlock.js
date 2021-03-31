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

/*
  Main function called in rest-server/index.js with two matrices uploaded in the client
  All errors are catched/propagated in/to the server
*/
async function multiplyMatrixBlock(A, B) {
  // Global used for the dimensions of the resulting matrix
  const MAX = A.length;

  // Block size
  const bSize = 2;

  let A1 = [...Array(MAX)].map((_) => Array(MAX));
  let A2 = [...Array(MAX)].map((_) => Array(MAX));
  let A3 = [...Array(MAX)].map((_) => Array(MAX));
  let B1 = [...Array(MAX)].map((_) => Array(MAX));
  let B2 = [...Array(MAX)].map((_) => Array(MAX));
  let B3 = [...Array(MAX)].map((_) => Array(MAX));
  let C1 = [...Array(MAX)].map((_) => Array(MAX));
  let C2 = [...Array(MAX)].map((_) => Array(MAX));
  let C3 = [...Array(MAX)].map((_) => Array(MAX));
  let D1 = [...Array(MAX)].map((_) => Array(MAX));
  let D2 = [...Array(MAX)].map((_) => Array(MAX));
  let D3 = [...Array(MAX)].map((_) => Array(MAX));
  let res = [...Array(MAX)].map((_) => Array(MAX));

  for (let i = 0; i < bSize; i++) {
    for (let j = 0; j < bSize; j++) {
      A1[i][j] = A[i][j];
      A2[i][j] = B[i][j];
    }
  }

  for (let i = 0; i < bSize; i++) {
    for (let j = bSize; j < MAX; j++) {
      B1[i][j - bSize] = A[i][j];
      B2[i][j - bSize] = B[i][j];
    }
  }

  for (let i = bSize; i < MAX; i++) {
    for (let j = 0; j < bSize; j++) {
      C1[i - bSize][j] = A[i][j];
      C2[i - bSize][j] = B[i][j];
    }
  }

  for (let i = bSize; i < MAX; i++) {
    for (let j = bSize; j < MAX; j++) {
      D1[i - bSize][j - bSize] = A[i][j];
      D2[i - bSize][j - bSize] = B[i][j];
    }
  }

  const A1A2 = await multiplyBlockRPC(A1, A2, MAX);
  const B1C2 = await multiplyBlockRPC(B1, C2, MAX);
  A3 = await addBlockRPC(A1A2, B1C2, MAX);

  const A1B2 = await multiplyBlockRPC(A1, B2, MAX);
  const B1D2 = await multiplyBlockRPC(B1, D2, MAX);
  B3 = await addBlockRPC(A1B2, B1D2, MAX);

  const C1A2 = await multiplyBlockRPC(C1, A2, MAX);
  const D1C2 = await multiplyBlockRPC(D1, C2, MAX);
  C3 = await addBlockRPC(C1A2, D1C2, MAX);

  const C1B2 = await multiplyBlockRPC(C1, B2, MAX);
  const D1D2 = await multiplyBlockRPC(D1, D2, MAX);
  D3 = await addBlockRPC(C1B2, D1D2, MAX);

  for (let i = 0; i < bSize; i++) {
    for (let j = 0; j < bSize; j++) {
      res[i][j] = A3[i][j];
    }
  }

  for (let i = 0; i < bSize; i++) {
    for (let j = bSize; j < MAX; j++) {
      res[i][j] = B3[i][j - bSize];
    }
  }

  for (let i = bSize; i < MAX; i++) {
    for (let j = 0; j < bSize; j++) {
      res[i][j] = C3[i - bSize][j];
    }
  }

  for (let i = bSize; i < MAX; i++) {
    for (let j = bSize; j < MAX; j++) {
      res[i][j] = D3[i - bSize][j - bSize];
    }
  }

  return res;
}

module.exports = multiplyMatrixBlock;

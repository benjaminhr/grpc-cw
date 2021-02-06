function convertArrayToProtoBuf(array) {
  return array.map((row) => {
    return {
      array: row,
    };
  });
}

function convertProtoBufToArray(array) {
  return array.map((row) => row.array);
}

function createBlock(A, B, MAX) {
  return {
    A: convertArrayToProtoBuf(A),
    B: convertArrayToProtoBuf(B),
    MAX,
  };
}

module.exports = {
  convertArrayToProtoBuf,
  convertProtoBufToArray,
  createBlock,
};

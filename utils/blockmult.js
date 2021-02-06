function multiplyBlock(A, B, MAX) {
  const C = [...Array(MAX)].map((_) => Array(MAX));
  C[0][0] = A[0][0] * B[0][0] + A[0][1] * B[1][0];
  C[0][1] = A[0][0] * B[0][1] + A[0][1] * B[1][1];
  C[1][0] = A[1][0] * B[0][0] + A[1][1] * B[1][0];
  C[1][1] = A[1][0] * B[0][1] + A[1][1] * B[1][1];
  return C;
}

function addBlock(A, B, MAX) {
  const C = [...Array(MAX)].map((_) => Array(MAX));

  for (let i = 0; i < C.length; i++) {
    for (let j = 0; j < C.length; j++) {
      C[i][j] = A[i][j] + B[i][j];
    }
  }

  return C;
}

module.exports = {
  addBlock,
  multiplyBlock,
};

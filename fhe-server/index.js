const SEAL = require('node-seal');

(async () => {
  const seal = await SEAL();

  const schemeType = seal.SchemeType.bfv;
  const securityLevel = seal.SecurityLevel.tc128;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
  const bitSize = 20;

  const encParms = seal.EncryptionParameters(schemeType);
  encParms.setPolyModulusDegree(polyModulusDegree);
  encParms.setCoeffModulus(
    seal.CoeffModulus.Create(
      polyModulusDegree,
      Int32Array.from(bitSizes)
    )
  );
  encParms.setPlainModulus(
    seal.PlainModulus.Batching(
      polyModulusDegree,
      bitSize
    )
  );

  const context = seal.Context(encParms, true, securityLevel);

  if (!context.parametersSet()) {
    throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.');
  }

  const keyGenerator = seal.KeyGenerator(context);
  const evaluator = seal.Evaluator(context);
  const batchEncoder = seal.BatchEncoder(context);

  // Your code for Microsoft SEAL operations goes here
})();

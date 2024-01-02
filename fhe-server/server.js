const express = require('express');
const SEAL = require('node-seal');
const cors = require('cors');  // Import cors module

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());  // Enable CORS for all routes

app.post('/seal-operation', async (req, res) => {
  const seal = await SEAL();




  // Perform Microsoft SEAL operations using data from req.body

  // Dummy operation: Add two numbers
  const result = req.body.number1 + req.body.number2;

  res.json({ result });
});

app.post('/seal-makepara',async(req,res) => {
  const seal = await SEAL();
  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 4096
  const bitSizes = [36,36,37]
  const bitSize = 20

  const encParms = seal.EncryptionParameters(schemeType)

      // Assign Poly Modulus Degree
      encParms.setPolyModulusDegree(polyModulusDegree)

      // Create a suitable set of CoeffModulus primes
      encParms.setCoeffModulus(
        seal.CoeffModulus.Create(
          polyModulusDegree,
          Int32Array.from(bitSizes)
        )
      )

          // Assign a PlainModulus (only for bfv/bgv scheme type)
    encParms.setPlainModulus(
      seal.PlainModulus.Batching(
        polyModulusDegree,
        bitSize
      )
    )

        ////////////////////////
    // Context
    ////////////////////////

    // Create a new Context
    const context = seal.Context(
      encParms,
      true,
      securityLevel
    )

    // Helper to check if the Context was created successfully
    if (!context.parametersSet()) {
      throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
    }

        // Create a new KeyGenerator (use uploaded keys if applicable)
        const keyGenerator = seal.KeyGenerator(
          context
        )
})

app.post('/getSchemeType', async(req, res) => {
  const seal = await SEAL();
  // สร้างตัวแปร schemeType ด้วยค่าที่คุณต้องการ
  const schemeType = seal.SchemeType;
  const securityLevel = seal.SecurityLevel;
  const polyModulusDegree = seal.polyModulusDegree;
  const sealOption = seal

  // ส่งค่า schemeType กลับไปยังหน้าบ้านในรูปแบบ JSON
  res.status(200).json({ schemeType,securityLevel,polyModulusDegree,sealOption });
});

app.post('/createencryptparam',async(req,res)=>{
  const seal = await SEAL();

//   const parms = new EncryptionParameters();
// parms.setPolyModulus("1x^2048 + 1");
// parms.setCoeffModulus(seal.CoeffModulus.BFVDefault(2048));
// parms.setPlainModulus(seal.PlainModulus.Batching(2048, [20, 20, 20, 20]));

////////////////////////
// Encryption Parameters
////////////////////////

const schemeType = seal.SchemeType.bfv
const securityLevel = seal.SecurityLevel.tc128
const polyModulusDegree = 4096
const bitSizes = [36, 36, 37]
const bitSize = 20

const encParms = seal.EncryptionParameters(schemeType)

// Set the PolyModulusDegree
encParms.setPolyModulusDegree(polyModulusDegree)

// Create a suitable set of CoeffModulus primes
encParms.setCoeffModulus(
  seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
)

// Set the PlainModulus to a prime of bitSize 20.
encParms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize))

////////////////////////
// Context
////////////////////////

// Create a new Context
const context = seal.Context(
  encParms, // Encryption Parameters
  true, // ExpandModChain
  securityLevel // Enforce a security level
)
 console.log('This is parms',encParms);
 console.log('This is context',context);
 console.log('This is securityLevel',securityLevel);

if (!context.parametersSet()) {
  throw new Error(
    'Could not set the parameters in the given context. Please try different encryption parameters.'
  )
}
const keyGenerator = seal.KeyGenerator(
  context
)
console.log('This is Key Generate',keyGenerator);
    // Get the SecretKey from the keyGenerator
    const Secret_key_G_KEy_ = keyGenerator.secretKey();
    const secretKey = keyGenerator.secretKey();
    const publicKey = keyGenerator.createPublicKey();
    // Get the PublicKey from the keyGenerator
    const Public_key_G_KEy_ = keyGenerator.createPublicKey()
    console.log('This is Key Generate secretKey',Secret_key_G_KEy_);
    console.log('This is Key Generate createPublicKey',Public_key_G_KEy_);
    const secretBase64Key = secretKey.save()
const publicBase64Key = publicKey.save()
console.log('This is secretKey',secretBase64Key);
console.log('This is publicKey',publicBase64Key);
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

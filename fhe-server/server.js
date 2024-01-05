const express = require('express');
const SEAL = require('node-seal');
const cors = require('cors');  // Import cors module
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
      callBack(null, `FunOfHeuristic_${file.originalname}`)
  }
})

const upload = multer({ storage: storage })




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

app.get('/getSchemeType', async(req, res) => {
  const seal = await SEAL();
  // สร้างตัวแปร schemeType ด้วยค่าที่คุณต้องการ
  const schemeType = seal.SchemeType;
  const securityLevel = seal.SecurityLevel;
  const polyModulusDegree = seal.polyModulusDegree;
  const sealOption = seal

  // ส่งค่า schemeType กลับไปยังหน้าบ้านในรูปแบบ JSON
  res.status(200).json({ schemeType,securityLevel,polyModulusDegree,sealOption });
});

app.post('/creat-secret-key',async(req,res)=>{
  const seal = await SEAL();
  const secretKeyName = req.body.secretKeyName;
  console.log('this is secretKeyName',secretKeyName);

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
    const secretKey = keyGenerator.secretKey();

    // Get the PublicKey from the keyGenerator
    const secretBase64Key = secretKey.save()

res.status(200).json({ secretBase64Key,secretKeyName});
});

app.post('/creat-public-key',async(req,res)=>{
  const seal = await SEAL();
  const secretKey = req.body.secretKey;
  const publicKeyName = req.body.publicKeyName;
  const inputsecretKey = req.body.secretKey;
console.log('input secret key are :',inputsecretKey)
console.log('publicKeyName are',publicKeyName);

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

if (!context.parametersSet()) {
  throw new Error(
    'Could not set the parameters in the given context. Please try different encryption parameters.'
  )
}
const keyGenerator = seal.KeyGenerator(
  context
)
    // Get the SecretKey from the keyGenerator
    const publicKey = keyGenerator.createPublicKey(inputsecretKey);
    // Get the PublicKey from the keyGenerator

const publicBase64Key = publicKey.save()
res.status(200).json({ publicBase64Key,publicKeyName});
});


app.post('/encryption-file',async(req,res)=>{
const seal = await SEAL();
const plainText = req.body.fileToEncryption;
const publickey = req.body.publickey;


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

if (!context.parametersSet()) {
  throw new Error(
    'Could not set the parameters in the given context. Please try different encryption parameters.'
  )
};

console.log(context,publickey);
console.log('this is publickey',publickey);
console.log('this is plainText',plainText);

// const encryptor = seal.Encryptor(context,publickey);


// const cipherText = encryptor.encrypt(plainText)

// console.log('this is CipherText',cipherText);
// res.status(200).json({cipherText});
});

// กำหนดที่เก็บไฟล์ที่รับเข้ามา


// ให้ Express ใช้ middleware ในการรับไฟล์
app.post('/file', upload.single('file'), (req, res,next) => {
  // req.file จะมีข้อมูลของไฟล์ที่ถูกอัปโหลด
  const file = req.file;
  console.log('this is file',file);
  if (file) {
    console.log('File received:', file.filename);
    res.status(200).json({ message: 'File received successfully.' });
  } else {
    res.status(400).json({ message: 'No file received.' });
  }
});


// app.post('/file', upload.single('file'), (req, res, next) => {
//   const file = req.file;
//   console.log(file.filename);
//   if (!file) {
//     const error = new Error('No File')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//     res.send(file);
// })
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

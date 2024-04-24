const express = require('express');
const SEAL = require('node-seal');
const cors = require('cors');  // Import cors module
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require('fs');
const { log } = require('console');

const app = express();
const port = 3000;



app.use(express.json());
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());








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

console.log('schemeType',schemeType);
console.log('securityLevel',securityLevel);


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

// console.log('this is public key',publickey) ;
  const file = req.file;
  const publicKey = req.publickey;
  console.log('this is file',file);
  console.log('this is file',publicKey);
  if (file) {
    console.log('File received:', file.buffer);
    res.status(200).json({ message: 'File received successfully.' });
    const publickey = file.buffer ? file.buffer.toString('utf8') : '';
    console.log('This is public key:', publickey);
  } else {
    res.status(400).json({ message: 'No file received.' });
  }

});

app.post('/testform', upload.fields([{ name: 'fileToEncryption', maxCount: 1 }, { name: 'publickey', maxCount: 1 }]), async (req, res) => {
  const seal = await SEAL();

  ////////////////////////
// Encryption Parameters
////////////////////////

const schemeType = seal.SchemeType.bfv
const securityLevel = seal.SecurityLevel.tc128
const polyModulusDegree = 4096
const bitSizes = [36,36,37]
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

  const fileToEncryption = req.files['fileToEncryption'][0];
  const textpublickey = req.files['publickey'][0];



  // ตรวจสอบว่า req.files ถูกสร้างขึ้นถูกต้อง
  if (!fileToEncryption || !textpublickey) {
    return res.status(400).json({ message: 'Missing files.' });
  }

  // อ่านข้อมูลจาก Buffer ของไฟล์ public key
  const publicKeyString = textpublickey.buffer.toString('utf8');
  // const publicKey = seal.publicBase64Key.deserializeFrom(publicKeyString);
  // const publicKey = seal.publicBase64Key.fromString(publicKeyString);
  const uploadedPublicKey = seal.PublicKey(); // สร้าง instance ของ PublicKey
  uploadedPublicKey.load(context, publicKeyString);
  // const publicKey = new seal.PublicKey();
  // publicKey.load(publicKeyString);

  // อ่านข้อมูลจาก Buffer ของไฟล์ที่ต้องการเข้ารหัส
  const fileToEncryptString = fileToEncryption.buffer.toString('utf8');
  // console.log('this is fileToEncryptString', fileToEncryptString);
  const plainText = fileToEncryptString;

  // console.log(publicKeyString);
  // สร้าง Encryptor
  const encryptor = seal.Encryptor(context,uploadedPublicKey)
  // const plainText = seal.plainText(fileToEncryption);
  // console.log(plainText);
  const keyGenerator = seal.KeyGenerator(
    context
  );
  const secretKey = keyGenerator.secretKey();
  
  const publicKey = keyGenerator.createPublicKey();
  const encoder = seal.BatchEncoder(context)
  // console.log("this is plantext",plainText);
  const plainTextArray = new Int32Array(plainText.length);
  for (let i = 0; i < plainText.length; i++) {
      plainTextArray[i] = plainText.charCodeAt(i);
  }
  // console.log("this is plainTextArray  length",plainTextArray.length);
  // console.log("this is plainTextArray",plainTextArray);


  const encodedPlainText = encoder.encode(plainTextArray);

  const encryptors = seal.Encryptor(context, publicKey);

  // สร้าง Decryptor object เพื่อถอดรหัสข้อมูล
  const decryptor = seal.Decryptor(context, secretKey);
  
  // Encrypt the PlainText
  const ciphertext = encryptors.encrypt(encodedPlainText);
  // console.log('ciphertext',ciphertext);
  const cipherAbase64 = ciphertext.save() 
  console.log('cipherAbase64',cipherAbase64);
  const uploadedCipherText = seal.CipherText()
  uploadedCipherText.load(context, cipherAbase64)
  console.log('uploadedCipherText',uploadedCipherText);

  // Decrypt the CipherText
  const decryptedPlainText = decryptor.decrypt(uploadedCipherText);
  // console.log('decryptedPlainText',decryptedPlainText);
  
  // Decode the decrypted PlainText
  const decryptedArray = encoder.decode(decryptedPlainText);
  // console.log('decryptedArray Message:', decryptedArray);
  
  const asciiCodes = Array.from(decryptedArray);
  // console.log('asciiCodes Message:', asciiCodes);
  
  
  // Convert ASCII codes to characters
  const characters = asciiCodes.map(code => String.fromCharCode(code));
  // console.log('characters Message:', characters);
  
  
  // Join characters to form the original message
  const originalMessage = characters.join('');
  const stringer = originalMessage;
  
  console.log('Original Message:', originalMessage);
  console.log('stringer Message:', stringer);
  res.status(200).json({cipherAbase64 });

  // res.status(200).json({ message: 'Files received successfully.',plainTextA });
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

app.post('/tests',async(req, res) => {
  const seal = await SEAL();
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
const keyGenerator = seal.KeyGenerator(
  context
);
const secretKey = keyGenerator.secretKey();

const publicKey = keyGenerator.createPublicKey();

const secretBase64Key = secretKey.save()
const publicBase64Key = publicKey.save()
// console.log('this is test secretKey ',secretBase64Key);
// console.log('this is test publicKey ',publicBase64Key);
const encoder = seal.BatchEncoder(context)
const array = Int32Array.from([2, 22, 3, 4, 5])
const plainText = "Hello world";

  // Encode the Array
  // const plainText = encoder.encode(message)
  // const plainText = message

  const plainTextArray = new Int32Array(plainText.length);
    for (let i = 0; i < plainText.length; i++) {
        plainTextArray[i] = plainText.charCodeAt(i);
    }

    const encodedPlainText = encoder.encode(plainTextArray);

    console.log('Encoded message:', encodedPlainText);
    // console.log('Encoded message save:', encodedPlainText.save());



// สร้าง Encryptor object เพื่อเข้ารหัสข้อมูล
const encryptor = seal.Encryptor(context, publicKey);

// สร้าง Decryptor object เพื่อถอดรหัสข้อมูล
const decryptor = seal.Decryptor(context, secretKey);

// Encrypt the PlainText
const ciphertext = encryptor.encrypt(encodedPlainText);


// Decrypt the CipherText
const decryptedPlainText = decryptor.decrypt(ciphertext);
console.log('decryptedPlainText',decryptedPlainText);

// Decode the decrypted PlainText
const decryptedArray = encoder.decode(decryptedPlainText);
console.log('decryptedArray Message:', decryptedArray);

const asciiCodes = Array.from(decryptedArray);
console.log('asciiCodes Message:', asciiCodes);


// Convert ASCII codes to characters
const characters = asciiCodes.map(code => String.fromCharCode(code));
console.log('characters Message:', characters);


// Join characters to form the original message
const originalMessage = characters.join('');
const stringer = originalMessage;

console.log('Original Message:', originalMessage);
console.log('stringer Message:', stringer);


    res.send('G');
})


// app.get('/test', async (req, res) => {

//       // สร้าง SEAL object
//       const SEAL = require('node-seal');
//       const seal = await SEAL();

//       // กำหนดค่าพารามิเตอร์สำหรับการเข้ารหัส
//       const schemeType = seal.SchemeType.bfv;
//     const securityLevel = seal.SecurityLevel.tc128;
//     const polyModulusDegree = 4096;
//     const bitSizes = [36, 36, 37];
//     const bitSize = 20;

//     // สร้าง EncryptionParameters object
//     const parms = seal.EncryptionParameters(schemeType);
//     parms.setPolyModulusDegree(polyModulusDegree);
//     parms.setCoeffModulus(
//         seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
//     );
//     parms.setPlainModulus(
//         seal.PlainModulus.Batching(polyModulusDegree, bitSize)
//     );

//     // สร้าง Context object
//     const context = seal.Context(parms, true, securityLevel);

//     // สร้าง Encoder object
//     const encoder = seal.BatchEncoder(context);

//     // สร้าง KeyGenerator object
//     const keyGenerator = seal.KeyGenerator(context);
//     const publicKey = keyGenerator.createPublicKey();
//     const secretKey = keyGenerator.secretKey();

//     // สร้าง Encryptor object
//     const encryptor = seal.Encryptor(context, publicKey);

//     // ข้อความที่ต้องการเข้ารหัส
//     const message = "Hello, World!";

//     // แปลงข้อความเป็น Base64 string
//     const base64Message = Buffer.from(message).toString('base64');

//     // แปลง Base64 string เป็น Uint8Array
//     const encodedMessage = Uint8Array.from(base64Message, c => c.charCodeAt(0));

//     // แปลงข้อมูลเป็น plaintext
//     const plaintext = encoder.encode(encodedMessage);

//     // เข้ารหัสข้อความ
//     const ciphertext = encryptor.encrypt(plaintext);

//     console.log("Original message:", message);
//     console.log("Encrypted ciphertext:", ciphertext);
// });

app.post('/createparms', async (req, res) => {
  const seal = await SEAL();
  encParmss = await getpara(req.body);
  GKey = await getSecretKey(req.body);
  console.log('securityLevel',securityLevel);
  console.log('this is encParms test/ ', encParms);
  // console.log('---',encParms.parametersSet());
  // console.log('----',encParms instanceof EncryptionParameters);

  // console.log('this is context form parms ',await global.contexter);

  // G = seal.Context(
  //   encParms,
  //   true,
  //   securityLevel
  // )

  // console.log('This is G',G);
  // console.log('this is SecretKey form parms ',await GKey);
  // console.log('this is SecretKey form parms ',await GKey.save());


  // const keyGenerator = seal.KeyGenerator(global.contexter);
  // console.log('This is Key Generate', keyGenerator);

  // const secretKey = keyGenerator.secretKey();

  // app.post('/tests', (req, res) => {
  //   console.log('this is global.polyModulusDegree tests/ ', global.polyModulusDegree);
  // });



  app.post('/creat-secret-key', async (req, res) => {
    const seal = await SEAL();
    const secretKeyName = req.body.secretKeyName;
    console.log('this is secretKeyName', secretKeyName);
    console.log('this is context generate key/ ', context);

    const keyGenerator = seal.KeyGenerator(context);
    console.log('This is Key Generate', keyGenerator);

    const secretKey = keyGenerator.secretKey();
    const secretBase64Key = secretKey.save();

    res.status(200).json({ secretBase64Key, secretKeyName });
  });
});

app.post('/creat-two-key',async(req,res)=>{
  const seal = await SEAL();
  const keyName = req.body.twoKeyName;
  console.log('this is keyName',keyName);

//   const parms = new EncryptionParameters();
// parms.setPolyModulus("1x^2048 + 1");
// parms.setCoeffModulus(seal.CoeffModulus.BFVDefault(2048));
// parms.setPlainModulus(seal.PlainModulus.Batching(2048, [20, 20, 20, 20]));

////////////////////////
// Encryption Parameters
////////////////////////

const schemeType = seal.SchemeType.bfv
const securityLevel = seal.SecurityLevel.tc128
const polyModulusDegree = 32768
const bitSizes = [55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,56]
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
    console.log('This is Key secretBase64Key',secretBase64Key);
    const publicKey = keyGenerator.createPublicKey(secretKey);
    // Get the PublicKey from the keyGenerator
    const publicBase64Key = publicKey.save()

res.status(200).json({ secretBase64Key,keyName,publicBase64Key});
});



async function createKeyGenerator(seal, context) {
  return seal.KeyGenerator(context);
}


async function getpara(parms){
  const seal = await SEAL();
  polyModulusDegree = parms.polyModulusDegreeArrayValue;
  bitSizes = parms.CoefficientModulus
  bitSize = parms.PlainModulus

  switch (parms.schemeType) {
    case 'bfv':
      schemeType = seal.SchemeType.bfv;
      break;
    case 'bgv':
      schemeType = seal.SchemeType.bgv;
      break;
    case 'ckks':
      schemeType = seal.SchemeType.ckks;
      break;
    default:
      schemeType = seal.SchemeType.none;
      break;
  }

  switch (parms.SecurityLevelOptionValue) {
    case 'tc128':
      securityLevel = seal.SecurityLevel.tc128;
      break;
    case 'tc192':
      securityLevel = seal.SecurityLevel.tc192;
      break;
    case 'tc256':
      securityLevel = seal.SecurityLevel.tc256;
      break;
    default:
      securityLevel = seal.SecurityLevel.none;
      break;
  }

  const parmset = seal.EncryptionParameters(schemeType)

  parmset.setPolyModulusDegree(polyModulusDegree)

  parmset.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  )

  parmset.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize))

  encParms = parmset
  context = seal.Context(
    encParms,
    true,
    securityLevel
  )

  // console.log(context instanceof SEALContext);
  console.log(context.parametersSet()); // ตรวจสอบว่าพารามิเตอร์ของ context ถูกตั้งค่าหรือไม่

  if (!context.parametersSet()) {
    throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
  }

  const keyGenerator = seal.KeyGenerator(context)
  const secretKey = keyGenerator.secretKey();

  console.log('this is schemeType', schemeType);
  // console.log('this is context', context);
  console.log('this is secretKey', secretKey);
  return encParms;
}

async function getSecretKey(parms){
  const seal = await SEAL();
  polyModulusDegree = parms.polyModulusDegreeArrayValue;
  const bitSizes = parms.CoefficientModulus
  const bitSize = parms.PlainModulus

  let schemeType;

  switch (parms.schemeType) {
    case 'bfv':
      schemeType = seal.SchemeType.bfv;
      break;
    case 'bgv':
      schemeType = seal.SchemeType.bgv;
      break;
    case 'ckks':
      schemeType = seal.SchemeType.ckks;
      break;
    default:
      schemeType = seal.SchemeType.none;
      break;
  }

  switch (parms.SecurityLevelOptionValue) {
    case 'tc128':
      securityLevel = seal.SecurityLevel.tc128;
      break;
    case 'tc192':
      securityLevel = seal.SecurityLevel.tc192;
      break;
    case 'tc256':
      securityLevel = seal.SecurityLevel.tc256;
      break;
    default:
      securityLevel = seal.SecurityLevel.none;
      break;
  }

  const parmset = seal.EncryptionParameters(schemeType)

  parmset.setPolyModulusDegree(polyModulusDegree)

  parmset.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  )

  parmset.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize))

  const encParms = parmset
  const context = seal.Context(
    encParms,
    true,
    securityLevel
  )

  if (!context.parametersSet()) {
    throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
  }

  const keyGenerator = seal.KeyGenerator(context)
  const secretKey = keyGenerator.secretKey();

  console.log('this is schemeType', schemeType);
  // console.log('this is context', context);
  console.log('this is secretKey', secretKey);
  return secretKey;
}

app.post('/testsss', async (req, res) => {
  seal = await SEAL();
  console.log('this is global.polyModulusDegree ', polyModulusDegree);
  console.log('this is context from test ', context);
  console.log('this is encParms from test ', encParms);
  console.log(context.parametersSet()); // ตรวจสอบว่าพารามิเตอร์ของ context ถูกตั้งค่าหรือไม่
  const parmset = seal.EncryptionParameters(schemeType)

  parmset.setPolyModulusDegree(polyModulusDegree)

  parmset.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  )
  parmset.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize))
  context = seal.Context(
    parmset,
    true,
    securityLevel
  )

  if (!context.parametersSet()) {
    throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
  }

  const keyGenerator = seal.KeyGenerator(context)
  const secretKey = keyGenerator.secretKey();
  const publicKey = KeyGenerator.publicKey();

  console.log('this is schemeType', schemeType);
  // console.log('this is context', context);
  console.log('this is secretKey', secretKey);

});



 async function decrypted(ciphertext){
  const seal = await SEAL();
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
const keyGenerator = seal.KeyGenerator(
  context
);
const secretKey = keyGenerator.secretKey();

const publicKey = keyGenerator.createPublicKey();

const secretBase64Key = secretKey.save()
const publicBase64Key = publicKey.save()
// console.log('this is test secretKey ',secretBase64Key);
// console.log('this is test publicKey ',publicBase64Key);
const encoder = seal.BatchEncoder(context)
const array = Int32Array.from([2, 22, 3, 4, 5])

// สร้าง Decryptor object เพื่อถอดรหัสข้อมูล
const decryptor = seal.Decryptor(context, secretKey);

// Encrypt the PlainText

// Decrypt the CipherText
const decryptedPlainText = decryptor.decrypt(ciphertext);

// Decode the decrypted PlainText
const decryptedArray = encoder.decode(decryptedPlainText);
console.log('decryptedArray Message:', decryptedArray);

const asciiCodes = Array.from(decryptedArray);
console.log('asciiCodes Message:', asciiCodes);


// Convert ASCII codes to characters
const characters = asciiCodes.map(code => String.fromCharCode(code));
console.log('characters Message:', characters);


// Join characters to form the original message
const originalMessage = characters.join('');
const stringer = originalMessage;

console.log('Original Message:', originalMessage);
console.log('stringer Message:', stringer);


}




app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

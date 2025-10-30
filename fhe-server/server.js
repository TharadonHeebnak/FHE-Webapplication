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

app.get('/ping', (req, res) => {
  res.send('ok'); // check server status
});


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
  const polyModulusDegree = 32768
  const bitSizes = [55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,56]
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

app.post('/encrypt_files', upload.fields([{ name: 'fileToEncryption', maxCount: 1 }, { name: 'publickey', maxCount: 1 }]), async (req, res) => {
  console.log("Encrypting...");
  const seal = await SEAL();

  ////////////////////////
  // Encryption Parameters
  ////////////////////////

  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 32768
  const bitSizes = [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 56]
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
  const uploadedPublicKey = seal.PublicKey(); // สร้าง instance ของ PublicKey
  uploadedPublicKey.load(context, publicKeyString);

  // อ่านข้อมูลจาก Buffer ของไฟล์ที่ต้องการเข้ารหัส
  const base64String = Buffer.from(fileToEncryption.buffer).toString('base64');

  const plainText = base64String;

  const keyGenerator = seal.KeyGenerator(
    context
  );

  const encoder = seal.BatchEncoder(context)
  // console.log("this is plantext",plainText);
  const plainTextArray = new Int32Array(plainText.length);
  for (let i = 0; i < plainText.length; i++) {
    plainTextArray[i] = plainText.charCodeAt(i);
  }
  // console.log("this is plainTextArray  length",plainTextArray.length);


  const encodedPlainText = encoder.encode(plainTextArray);

  const encryptor = seal.Encryptor(context, uploadedPublicKey)


  // Encrypt the PlainText
  const ciphertext = encryptor.encrypt(encodedPlainText);
  const cipherAbase64 = ciphertext.save()
  const fileEncryptedName = fileToEncryption.originalname;
  console.log("Encrypted");
  res.status(200).json({ cipherAbase64, fileEncryptedName });
});

app.post('/decrypt_file', upload.fields([{ name: 'fileToDecryption', maxCount: 1 }, { name: 'secretkey', maxCount: 1 }]), async (req, res) => {
  const seal = await SEAL();

  ////////////////////////
  // Encryption Parameters
  ////////////////////////

  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 32768
  const bitSizes = [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 56]
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

  const fileToDecryption = req.files['fileToDecryption'][0];
  const textsecretkey = req.files['secretkey'][0];



  // ตรวจสอบว่า req.files ถูกสร้างขึ้นถูกต้อง
  if (!fileToDecryption || !textsecretkey) {
    return res.status(400).json({ message: 'Missing files.' });
  }
  console.log("this is textsecretkey ", textsecretkey);
  // อ่านข้อมูลจาก Buffer ของไฟล์ public key
  const secretKeyString = textsecretkey.buffer.toString('utf8');
  // const publicKey = seal.publicBase64Key.deserializeFrom(publicKeyString);
  // const publicKey = seal.publicBase64Key.fromString(publicKeyString);
  const uploadedSecretkey = seal.SecretKey(); // สร้าง instance ของ PublicKey
  uploadedSecretkey.load(context, secretKeyString);
  // const publicKey = new seal.PublicKey();
  // publicKey.load(publicKeyString);

  // อ่านข้อมูลจาก Buffer ของไฟล์ที่ต้องการเข้ารหัส
  const fileToDecryptionString = fileToDecryption.buffer.toString('utf8');
  // console.log('this is fileToDecryptionString', fileToDecryptionString);

  // const plainText = fileToEncryptString;

  // console.log(publicKeyString);
  // สร้าง Encryptor
  // const encryptor = seal.Encryptor(context,uploadedPublicKey)
  // const plainText = seal.plainText(fileToEncryption);
  // console.log(plainText);
  const keyGenerator = seal.KeyGenerator(
    context
  );
  const secretKey = keyGenerator.secretKey();

  // const publicKey = keyGenerator.createPublicKey();
  const encoder = seal.BatchEncoder(context)
  // console.log("this is plantext",plainText);
  // const plainTextArray = new Int32Array(plainText.length);
  // for (let i = 0; i < plainText.length; i++) {
  //     plainTextArray[i] = plainText.charCodeAt(i);
  // }
  // console.log("this is plainTextArray  length",plainTextArray.length);
  // console.log("this is plainTextArray",plainTextArray);


  // const encodedPlainText = encoder.encode(plainTextArray);

  // const encryptors = seal.Encryptor(context, publicKey);

  // สร้าง Decryptor object เพื่อถอดรหัสข้อมูล
  const decryptor = seal.Decryptor(context, uploadedSecretkey);

  // Encrypt the PlainText
  // const ciphertext = encryptors.encrypt(encodedPlainText);
  // console.log('ciphertext',ciphertext);
  // const cipherAbase64 = ciphertext.save()
  // console.log('cipherAbase64',cipherAbase64);
  const uploadedCipherText = seal.CipherText()
  uploadedCipherText.load(context, fileToDecryptionString)
  console.log('uploadedCipherText', uploadedCipherText);

  // Decrypt the CipherText
  const decryptedPlainText = decryptor.decrypt(uploadedCipherText);
  console.log('decryptedPlainText', decryptedPlainText);

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
  const decryptedFile = originalMessage;


  console.log('Original Message:', originalMessage);
  // console.log('stringer Message:', stringer);
  const fileDecryptedName = fileToDecryption.originalname;
  res.status(200).json({ decryptedFile, fileDecryptedName });

  // res.status(200).json({ message: 'Files received successfully.',plainTextA });
});
app.post('/decrypt_files', upload.fields([{ name: 'fileToDecryption', maxCount: 1 }, { name: 'secretkey', maxCount: 1 }]), async (req, res) => {
  console.log("Decrypting...");
  const seal = await SEAL();

  ////////////////////////
  // Encryption Parameters
  ////////////////////////

  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 32768
  const bitSizes = [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 56]
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

  const fileToDecryption = req.files['fileToDecryption'][0];
  const textsecretkey = req.files['secretkey'][0];



  // ตรวจสอบว่า req.files ถูกสร้างขึ้นถูกต้อง
  if (!fileToDecryption || !textsecretkey) {
    return res.status(400).json({ message: 'Missing files.' });
  }
  // อ่านข้อมูลจาก Buffer ของไฟล์ public key
  const secretKeyString = textsecretkey.buffer.toString('utf8');
  const uploadedSecretkey = seal.SecretKey(); // สร้าง instance ของ PublicKey
  uploadedSecretkey.load(context, secretKeyString);
  // อ่านข้อมูลจาก Buffer ของไฟล์ที่ต้องการเข้ารหัส
  const fileToDecryptionString = fileToDecryption.buffer.toString('utf8');

  const keyGenerator = seal.KeyGenerator(
    context
  );
  const secretKey = keyGenerator.secretKey();

  // const publicKey = keyGenerator.createPublicKey();
  const encoder = seal.BatchEncoder(context)

  // สร้าง Decryptor object เพื่อถอดรหัสข้อมูล
  const decryptor = seal.Decryptor(context, uploadedSecretkey);
  const uploadedCipherText = seal.CipherText()
  uploadedCipherText.load(context, fileToDecryptionString)

  // Decrypt the CipherText
  const decryptedPlainText = decryptor.decrypt(uploadedCipherText);

  // Decode the decrypted PlainText
  const decryptedArray = encoder.decode(decryptedPlainText);

  // จำนวนตำแหน่งที่ไม่เท่ากับ 0 ใน decryptedArray
  const length = decryptedArray.findIndex(value => value === 0);
  // สร้าง Int32Array ที่มีขนาดเท่ากับความยาวของข้อมูลที่ไม่เท่ากับ 0
  const asciiArray = decryptedArray.slice(0, length);
  // แปลง ASCII codes เป็นตัวอักษร
  const asciiString = String.fromCharCode.apply(null, asciiArray);

  decryptedFile = asciiString;
  const fileDecryptedName = fileToDecryption.originalname;
  console.log("Decrypted");
  res.status(200).json({ decryptedFile, fileDecryptedName });

  // res.status(200).json({ message: 'Files received successfully.',plainTextA });
});



app.post('/createparms', async (req, res) => {
  const seal = await SEAL();
  encParmss = await getpara(req.body);
  GKey = await getSecretKey(req.body);
  console.log('securityLevel', securityLevel);
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

app.post('/creat-two-key', async (req, res) => {
  const seal = await SEAL();
  const keyName = req.body.twoKeyName;

  ////////////////////////
  // Encryption Parameters
  ////////////////////////

  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 32768
  const bitSizes = [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 56]
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
  const secretKey = keyGenerator.secretKey();

  // Get the PublicKey from the keyGenerator
  const secretBase64Key = secretKey.save()
  const publicKey = keyGenerator.createPublicKey(secretKey);
  // Get the PublicKey from the keyGenerator
  const publicBase64Key = publicKey.save()

  res.status(200).json({ secretBase64Key, keyName, publicBase64Key });
});

async function getpara(parms) {
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

async function getSecretKey(parms) {
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




app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

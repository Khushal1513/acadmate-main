const admin = require("firebase-admin");
// ----------------------------------------------------
// NOTE: We no longer need 'path', so we can remove it.
// const path = require("path"); 
// ----------------------------------------------------

// 1. Get the JSON string from the environment variable set on Render
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

let serviceAccount;

try {
  // 2. Parse the string back into a JavaScript object
  serviceAccount = JSON.parse(serviceAccountString);
  
  // 3. CRITICAL: Replace escaped newlines (\\n) with actual newline characters (\n)
  // This ensures the Private Key is read correctly by the Firebase SDK.
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

} catch (error) {
  // This block catches the error if the environment variable is missing or malformed
  console.error("FIREBASE CONFIG ERROR: Failed to parse service account JSON from environment variable.", error);
  // Log the string to see what was passed (only during dev/debugging)
  // console.log("Received string:", serviceAccountString); 
  process.exit(1); // Exit if critical configuration is missing
}

// 4. Initialize Firebase Admin SDK with the secure credential object
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db, admin };
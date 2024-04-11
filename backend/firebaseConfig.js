import admin from 'firebase-admin';
import serviceAccount from './forum-lucy-firebase-adminsdk-x4arr-1e076ecc8d.json' assert { type: 'json' };

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	// storageBucket: 'gs://forum-jenna.appspot.com',
});

// const bucket = admin.storage().bucket();

const db = admin.firestore();

export { admin, db };

import admin from 'firebase-admin';
import serviceAccount from './forum-jenna-firebase-adminsdk-em14u-156edbb8f1.json' assert { type: 'json' };

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: 'gs://forum-jenna.appspot.com',
});

const bucket = admin.storage().bucket();

export { admin, bucket };

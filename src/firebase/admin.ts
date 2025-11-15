import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const firebaseConfig: FirebaseOptions = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

function getAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

export function getAdminSdks() {
    const app = getAdminApp();
    return {
        auth: getAuth(app),
        firestore: getFirestore(app)
    }
}

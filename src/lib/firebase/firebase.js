import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase web configuration is public by design; access is enforced by Auth and Firestore Rules.
const firebaseConfig = {
  apiKey: "AIzaSyDsfbjXJO8oenfYJpdqWbaVWWS4bAwVPoY",
  authDomain: "emporio-arcano.firebaseapp.com",
  projectId: "emporio-arcano",
  storageBucket: "emporio-arcano.firebasestorage.app",
  messagingSenderId: "175783071062",
  appId: "1:175783071062:web:cea902e951fb9f3aa81af7",
  measurementId: "G-4297FHDZKE"
};


let cachedServices;

function getServices() {
	if (typeof window === 'undefined') {
		throw new Error('Os serviços Firebase só podem ser acessados no navegador.');
	}

	if (!cachedServices) {
		const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
		cachedServices = {
			auth: getAuth(app),
			db: getFirestore(app)
		};
	}

	return cachedServices;
}

export function getAuthClient() {
	return getServices().auth;
}

export function getFirestoreClient() {
	return getServices().db;
}

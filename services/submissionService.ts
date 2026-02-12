
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * FIREBASE CONFIGURATION
 * Replace these values with your actual config from Firebase Console.
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "scope-x-diagnostics.firebaseapp.com",
  projectId: "scope-x-diagnostics",
  storageBucket: "scope-x-diagnostics.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let db: any = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase initialization failed, falling back to LocalStorage.");
  }
}

// Local Storage Helpers
const getLocalData = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const saveLocalData = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const submitHospitalEnquiry = async (data: any): Promise<boolean> => {
  const record = { ...data, id: 'local_' + Date.now(), type: 'hospital', timestamp: new Date().toLocaleString() };
  
  if (db) {
    try {
      await addDoc(collection(db, "hospital_leads"), { ...data, type: 'hospital', createdAt: serverTimestamp() });
      return true;
    } catch (error) {
      console.error('Firebase Error:', error);
    }
  }

  // Fallback to LocalStorage
  const local = getLocalData('sx_hospital_leads');
  saveLocalData('sx_hospital_leads', [record, ...local]);
  return true;
};

export const submitCampBooking = async (data: any): Promise<boolean> => {
  const record = { ...data, id: 'local_' + Date.now(), type: 'camp', timestamp: new Date().toLocaleString() };

  if (db) {
    try {
      await addDoc(collection(db, "camp_bookings"), { ...data, type: 'camp', createdAt: serverTimestamp() });
      return true;
    } catch (error) {
      console.error('Firebase Error:', error);
    }
  }

  // Fallback to LocalStorage
  const local = getLocalData('sx_camp_bookings');
  saveLocalData('sx_camp_bookings', [record, ...local]);
  return true;
};

export const fetchAdminData = async (): Promise<any[]> => {
  let cloudData: any[] = [];

  if (db) {
    try {
      const hSnap = await getDocs(query(collection(db, "hospital_leads"), orderBy("createdAt", "desc")));
      const cSnap = await getDocs(query(collection(db, "camp_bookings"), orderBy("createdAt", "desc")));
      
      cloudData = [
        ...hSnap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().createdAt?.toDate().toLocaleString() || d.data().timestamp })),
        ...cSnap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().createdAt?.toDate().toLocaleString() || d.data().timestamp }))
      ];
    } catch (error) {
      console.warn("Cloud fetch failed, using local records only.");
    }
  }

  const localH = getLocalData('sx_hospital_leads');
  const localC = getLocalData('sx_camp_bookings');
  
  const merged = [...cloudData, ...localH, ...localC].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return merged;
};

export const deleteLead = async (id: string, type: 'hospital' | 'camp'): Promise<boolean> => {
  if (id.startsWith('local_')) {
    const key = type === 'hospital' ? 'sx_hospital_leads' : 'sx_camp_bookings';
    const filtered = getLocalData(key).filter((item: any) => item.id !== id);
    saveLocalData(key, filtered);
    return true;
  }

  if (db) {
    try {
      const collectionName = type === 'hospital' ? 'hospital_leads' : 'camp_bookings';
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }
  return false;
};

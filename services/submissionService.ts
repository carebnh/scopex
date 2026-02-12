
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

// Check if Firebase is actually configured with a real key
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.apiKey.length > 10;

let db: any = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase initialization failed, operating in Local Mode.");
  }
}

// Unified Local Storage Keys
const STORAGE_KEYS = {
  HOSPITAL: 'scopex_local_hospital_leads',
  CAMP: 'scopex_local_camp_bookings'
};

const getLocalData = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const saveLocalData = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

/**
 * Saves to both Cloud (if available) and LocalStorage for immediate UI feedback
 */
export const submitHospitalEnquiry = async (data: any): Promise<boolean> => {
  const timestamp = new Date().toLocaleString();
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const record = { ...data, id: localId, type: 'hospital', timestamp };
  
  // Always save locally for the Dashboard to see it immediately
  const local = getLocalData(STORAGE_KEYS.HOSPITAL);
  saveLocalData(STORAGE_KEYS.HOSPITAL, [record, ...local]);

  if (db) {
    try {
      await addDoc(collection(db, "hospital_leads"), { 
        ...data, 
        type: 'hospital', 
        createdAt: serverTimestamp(),
        timestamp // redundancy for display
      });
    } catch (error) {
      console.error('Cloud Sync Failed:', error);
    }
  }

  return true;
};

export const submitCampBooking = async (data: any): Promise<boolean> => {
  const timestamp = new Date().toLocaleString();
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const record = { ...data, id: localId, type: 'camp', timestamp };

  // Always save locally
  const local = getLocalData(STORAGE_KEYS.CAMP);
  saveLocalData(STORAGE_KEYS.CAMP, [record, ...local]);

  if (db) {
    try {
      await addDoc(collection(db, "camp_bookings"), { 
        ...data, 
        type: 'camp', 
        createdAt: serverTimestamp(),
        timestamp 
      });
    } catch (error) {
      console.error('Cloud Sync Failed:', error);
    }
  }

  return true;
};

export const fetchAdminData = async (): Promise<any[]> => {
  let cloudData: any[] = [];

  // 1. Fetch from Firestore if available
  if (db) {
    try {
      const hSnap = await getDocs(query(collection(db, "hospital_leads"), orderBy("createdAt", "desc")));
      const cSnap = await getDocs(query(collection(db, "camp_bookings"), orderBy("createdAt", "desc")));
      
      const cloudH = hSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(), 
        type: 'hospital',
        timestamp: d.data().createdAt?.toDate().toLocaleString() || d.data().timestamp 
      }));
      
      const cloudC = cSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(), 
        type: 'camp',
        timestamp: d.data().createdAt?.toDate().toLocaleString() || d.data().timestamp 
      }));

      cloudData = [...cloudH, ...cloudC];
    } catch (error) {
      console.warn("Cloud access restricted or unavailable.");
    }
  }

  // 2. Fetch from LocalStorage
  const localH = getLocalData(STORAGE_KEYS.HOSPITAL).map((item: any) => ({ ...item, type: 'hospital' }));
  const localC = getLocalData(STORAGE_KEYS.CAMP).map((item: any) => ({ ...item, type: 'camp' }));
  
  // 3. Merge and Deduplicate (prefer cloud version if available by matching unique traits like mobile + name)
  const merged = [...cloudData, ...localH, ...localC];
  
  // Basic deduplication logic based on id or content
  const uniqueDataMap = new Map();
  merged.forEach(item => {
    // If it's a cloud item, it has a priority ID
    const uniqueKey = item.id.startsWith('local_') ? (item.mobile || item.phone) + "_" + (item.hospitalName || item.organization) : item.id;
    if (!uniqueDataMap.has(uniqueKey) || !item.id.startsWith('local_')) {
      uniqueDataMap.set(uniqueKey, item);
    }
  });

  return Array.from(uniqueDataMap.values()).sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const deleteLead = async (id: string, type: 'hospital' | 'camp'): Promise<boolean> => {
  // Always clear from LocalStorage first
  const key = type === 'hospital' ? STORAGE_KEYS.HOSPITAL : STORAGE_KEYS.CAMP;
  const localFiltered = getLocalData(key).filter((item: any) => item.id !== id);
  saveLocalData(key, localFiltered);

  // Then clear from Cloud if it's a cloud ID
  if (db && !id.startsWith('local_')) {
    try {
      const collectionName = type === 'hospital' ? 'hospital_leads' : 'camp_bookings';
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      console.error('Cloud Delete Failed:', error);
      return false;
    }
  }
  return true;
};

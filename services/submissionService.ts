
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

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "scope-x-diagnostics.firebaseapp.com",
  projectId: "scope-x-diagnostics",
  storageBucket: "scope-x-diagnostics.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.apiKey.length > 10;

let db: any = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase initialization failed, falling back to Local Mode.");
  }
}

const STORAGE_KEYS = {
  HOSPITAL: 'scopex_v2_hospital_leads',
  CAMP: 'scopex_v2_camp_bookings'
};

const getLocalData = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const saveLocalData = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const submitHospitalEnquiry = async (data: any): Promise<boolean> => {
  const timestamp = new Date().toLocaleString();
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const record = { ...data, id: localId, type: 'hospital', timestamp };
  
  // 1. Primary Save: Local Storage (Immediate & Guaranteed)
  const local = getLocalData(STORAGE_KEYS.HOSPITAL);
  saveLocalData(STORAGE_KEYS.HOSPITAL, [record, ...local]);

  // 2. Secondary Save: Cloud (Optional)
  if (db) {
    try {
      await addDoc(collection(db, "hospital_leads"), { 
        ...data, 
        type: 'hospital', 
        createdAt: serverTimestamp(),
        timestamp
      });
    } catch (error) {
      console.error('Cloud Sync Failed:', error);
    }
  }
  return true;
};

export const submitCampBooking = async (data: any): Promise<boolean> => {
  const timestamp = new Date().toLocaleString();
  const localId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const record = { ...data, id: localId, type: 'camp', timestamp };

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

  if (db) {
    try {
      const hSnap = await getDocs(query(collection(db, "hospital_leads"), orderBy("createdAt", "desc")));
      const cSnap = await getDocs(query(collection(db, "camp_bookings"), orderBy("createdAt", "desc")));
      
      cloudData = [
        ...hSnap.docs.map(d => ({ id: d.id, ...d.data(), type: 'hospital' })),
        ...cSnap.docs.map(d => ({ id: d.id, ...d.data(), type: 'camp' }))
      ];
    } catch (error) {
      console.warn("Cloud connection issue. Showing local records only.");
    }
  }

  const localH = getLocalData(STORAGE_KEYS.HOSPITAL);
  const localC = getLocalData(STORAGE_KEYS.CAMP);
  
  // Merge and prioritize by timestamp
  const merged = [...cloudData, ...localH, ...localC].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Strict deduplication by ID
  const seen = new Set();
  return merged.filter(item => {
    const isDuplicate = seen.has(item.id);
    seen.add(item.id);
    return !isDuplicate;
  });
};

export const deleteLead = async (id: string, type: 'hospital' | 'camp'): Promise<boolean> => {
  const key = type === 'hospital' ? STORAGE_KEYS.HOSPITAL : STORAGE_KEYS.CAMP;
  const localFiltered = getLocalData(key).filter((item: any) => item.id !== id);
  saveLocalData(key, localFiltered);

  if (db && !id.startsWith('local_')) {
    try {
      const collectionName = type === 'hospital' ? 'hospital_leads' : 'camp_bookings';
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error('Cloud Delete Failed:', error);
      return false;
    }
  }
  return true;
};

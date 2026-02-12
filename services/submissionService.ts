
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
 * 1. Go to Firebase Console (console.firebase.google.com)
 * 2. Create a project "Scope X Diagnostics"
 * 3. Add a Web App and copy the config below
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "scope-x-diagnostics.firebaseapp.com",
  projectId: "scope-x-diagnostics",
  storageBucket: "scope-x-diagnostics.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const submitHospitalEnquiry = async (data: any): Promise<boolean> => {
  try {
    await addDoc(collection(db, "hospital_leads"), {
      ...data,
      type: 'hospital',
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Firebase Submission failed:', error);
    return false;
  }
};

export const submitCampBooking = async (data: any): Promise<boolean> => {
  try {
    await addDoc(collection(db, "camp_bookings"), {
      ...data,
      type: 'camp',
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Firebase Submission failed:', error);
    return false;
  }
};

export const fetchAdminData = async (): Promise<any[]> => {
  try {
    const hospitalQuery = query(collection(db, "hospital_leads"), orderBy("createdAt", "desc"));
    const campQuery = query(collection(db, "camp_bookings"), orderBy("createdAt", "desc"));

    const [hospitalSnap, campSnap] = await Promise.all([
      getDocs(hospitalQuery),
      getDocs(campQuery)
    ]);

    const hospitalLeads = hospitalSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Format timestamp for display if it's a Firestore Timestamp
      timestamp: doc.data().createdAt?.toDate().toLocaleString() || doc.data().timestamp
    }));

    const campBookings = campSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().createdAt?.toDate().toLocaleString() || doc.data().timestamp
    }));

    return [...hospitalLeads, ...campBookings].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Firebase Fetch failed:', error);
    // Return empty or mock if config is missing
    return [];
  }
};

export const deleteLead = async (id: string, type: 'hospital' | 'camp'): Promise<boolean> => {
  try {
    const collectionName = type === 'hospital' ? 'hospital_leads' : 'camp_bookings';
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error('Firebase Delete failed:', error);
    return false;
  }
};

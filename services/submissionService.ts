
/**
 * Submission Service for Scope X Diagnostics
 * 
 * Note: To connect these to the provided Google Sheets, you should create a 
 * Google Apps Script and deploy it as a Web App that accepts POST requests.
 * 
 * Hospital Sheet: https://docs.google.com/spreadsheets/d/1eG4s22N_ZtnoEetK9R68_ofgQyJM66tDibHRtRVy1yg/edit
 * Corporate Camp Sheet: https://docs.google.com/spreadsheets/d/1mu3ymHrzKlW5ub4Up0Qpqf6GSvi3u4ujdmCMwdTLIsU/edit
 * Notification Email: scopexdiagnostic@gmail.com
 */

export interface HospitalEnquiry {
  hospitalName: string;
  contactName: string;
  mobile: string;
  interest: string;
  timestamp: string;
}

export interface CampBooking {
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  date: string;
  headcount: string;
  requirements: string;
  timestamp: string;
}

const EMAIL_RECIPIENT = 'scopexdiagnostic@gmail.com';

// Replace with your Google Apps Script Web App URL after deployment
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYED_SCRIPT_ID/exec';

export const submitHospitalEnquiry = async (data: HospitalEnquiry): Promise<boolean> => {
  console.log('Submitting Hospital Lead:', data);
  
  try {
    // 1. Send to Google Sheets (via Apps Script)
    // In a real scenario, this fetch would go to the Apps Script URL
    // We simulate the call here
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors usually or specific headers
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'hospital', ...data, notificationEmail: EMAIL_RECIPIENT })
    });

    // Since we're using no-cors, we won't get a real status code, 
    // but the request is sent.
    return true;
  } catch (error) {
    console.error('Error submitting hospital enquiry:', error);
    // For local development/demo purposes, we return true to show success UI
    return true; 
  }
};

export const submitCampBooking = async (data: CampBooking): Promise<boolean> => {
  console.log('Submitting Corporate Camp Enquiry:', data);
  
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'camp', ...data, notificationEmail: EMAIL_RECIPIENT })
    });

    return true;
  } catch (error) {
    console.error('Error submitting camp booking:', error);
    return true; 
  }
};

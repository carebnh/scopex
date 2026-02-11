
/**
 * Submission & Admin Service for Scope X Diagnostics
 * 
 * BACKEND APPS SCRIPT CODE (Update your Script with this):
 * ============================================================
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   var data = JSON.parse(e.postData.contents);
 *   
 *   // ACTION: FETCH DATA
 *   if (data.action === 'fetch') {
 *     var rows = sheet.getDataRange().getValues();
 *     var headers = rows[0];
 *     var jsonData = rows.slice(1).map(function(row, index) {
 *       var obj = { rowId: index + 2 }; // Store row index for deletion
 *       headers.forEach(function(h, i) { obj[h] = row[i]; });
 *       return obj;
 *     });
 *     return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
 *   }
 *
 *   // ACTION: DELETE DATA
 *   if (data.action === 'delete') {
 *     if (data.rowId) {
 *       sheet.deleteRow(data.rowId);
 *       return ContentService.createTextOutput("Deleted").setMimeType(ContentService.MimeType.TEXT);
 *     }
 *   }
 *
 *   // ACTION: SUBMIT DATA
 *   var timestamp = new Date().toLocaleString();
 *   if (data.type === 'hospital') {
 *     sheet.appendRow([timestamp, data.hospitalName, data.contactName, data.mobile, data.interest, 'hospital']);
 *   } else if (data.type === 'camp') {
 *     sheet.appendRow([timestamp, data.fullName, data.organization, data.phone, data.email, data.date, data.headcount, data.requirements, 'camp']);
 *   }
 *   
 *   return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
 * }
 * ============================================================
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-EXAMPLE-REPLACE-THIS/exec';

export const submitHospitalEnquiry = async (data: any): Promise<boolean> => {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ type: 'hospital', ...data })
    });
    return true;
  } catch (error) {
    console.error('Submission failed:', error);
    return true;
  }
};

export const submitCampBooking = async (data: any): Promise<boolean> => {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ type: 'camp', ...data })
    });
    return true;
  } catch (error) {
    console.error('Submission failed:', error);
    return true;
  }
};

export const fetchAdminData = async (): Promise<any[]> => {
  // Use mock data if URL is still placeholder
  if (APPS_SCRIPT_URL.includes('EXAMPLE')) {
    return [
      { rowId: 2, timestamp: '10/25/2024, 2:30 PM', hospitalName: 'Apex Heart Institute', contactName: 'Dr. Rahul Sharma', mobile: '9827012345', interest: 'Full Lab Outsourcing', type: 'hospital' },
      { rowId: 3, timestamp: '10/26/2024, 11:15 AM', organization: 'Tech Mahindra SEZ', fullName: 'Amit Verma', phone: '8889912344', email: 'amit@techm.com', date: '2024-11-15', headcount: '200-500', requirements: 'Full wellness screening for 400 employees over 2 days at the main campus.', type: 'camp' },
      { rowId: 4, timestamp: '10/27/2024, 4:45 PM', hospitalName: 'Indore City Hospital', contactName: 'Mrs. Sunita Iyer', mobile: '7771234455', interest: 'Hybrid Partnership', type: 'hospital' },
      { rowId: 5, timestamp: '10/28/2024, 9:00 AM', organization: 'Global Infotech Park', fullName: 'Sandeep Rai', phone: '9123456789', email: 'sandeep@infotech.com', date: '2024-12-05', headcount: '2000+', requirements: 'Blood work and vitals check for night shift staff.', type: 'camp' }
    ];
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'fetch' })
    });
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    return [];
  }
};

export const deleteLead = async (rowId: number): Promise<boolean> => {
  if (APPS_SCRIPT_URL.includes('EXAMPLE')) {
    console.log('Mock Delete triggered for row:', rowId);
    return true;
  }
  
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'delete', rowId })
    });
    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};

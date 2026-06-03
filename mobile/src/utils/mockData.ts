/**
 * MOCK DATA SYSTEM - Safely providing structures for the real API
 */

export const mockPatient = {
  firstName: '',
  lastName: '',
  email: '',
  dob: '',
  heartRate: '--',
  steps: 0,
  sleepHours: 0,
  riskLevel: 'LOW',
};

export const mockRecommendations = [];
export const mockRecords = [];
export const mockAIResults = [{ 
  riskLevel: 'LOW', 
  confidence: 0.95, 
  summary: 'Analysis complete.', 
  recommendations: [],
  validationStatus: 'STABLE' 
}];
export const mockDoctorNote = { doctorName: 'No notes yet', date: '' };
export const mockPatients = [];
export const mockHealthServices = [];

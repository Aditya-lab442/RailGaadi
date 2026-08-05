export interface MajorStation {
  code: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const MAJOR_STATIONS: Record<string, MajorStation> = {
  NDLS: { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', lat: 28.643, lng: 77.2197 },
  CSMT: { code: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai', state: 'Maharashtra', lat: 18.9398, lng: 72.8355 },
  MMCT: { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', lat: 18.9696, lng: 72.8193 },
  HWH: { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', lat: 22.5836, lng: 88.3426 },
  MAS: { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2757 },
  SBC: { code: 'SBC', name: 'Bengaluru City', city: 'Bengaluru', state: 'Karnataka', lat: 12.9781, lng: 77.5697 },
  SC: { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', lat: 17.4339, lng: 78.5016 },
  ADI: { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0258, lng: 72.6006 },
  PNBE: { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', lat: 25.6022, lng: 85.1376 },
  CNB: { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4547, lng: 80.3503 },
  LKO: { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8322, lng: 80.9234 },
  BSB: { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3268, lng: 82.9863 },
  BPL: { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.266, lng: 77.4126 },
  NGP: { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', lat: 21.1524, lng: 79.0888 },
  JP: { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', lat: 26.9204, lng: 75.7878 },
  GHY: { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', lat: 26.182, lng: 91.751 },
  TVC: { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4875, lng: 76.9525 },
  BZA: { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.518, lng: 80.6202 },
  PUNE: { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', lat: 18.5289, lng: 73.8744 },
  ST: { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', lat: 21.2049, lng: 72.8406 },
  BRC: { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', lat: 22.3107, lng: 73.1812 },
  R: { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2582, lng: 81.6329 },
  BSP: { code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1409 },
  VSKP: { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.7214, lng: 83.2894 },
  BBS: { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2657, lng: 85.843 },
  AGC: { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1577, lng: 77.9908 },
  GWL: { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2163, lng: 78.1884 },
  VGLJ: { code: 'VGLJ', name: 'VGL Jhansi Junction', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5562 },
  PRYJ: { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4435, lng: 81.8267 },
  DDU: { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Junction', city: 'Mughalsarai', state: 'Uttar Pradesh', lat: 25.2818, lng: 83.1186 },
};

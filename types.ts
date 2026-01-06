
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  ALD_REC = 'ALD_REC',
  WET_PROCESS = 'WET_PROCESS',
  TICKET_SYSTEM = 'TICKET_SYSTEM',
  WAREHOUSE = 'WAREHOUSE'
}

export interface ALDRecommendation {
  element: string;
  reactionTemp: string;
  reactantA: string;
  doseA: string;
  heatA: string;
  reactantB: string;
  doseB: string;
  heatB: string;
  source: string;
  score: number;
  details: string;
  isLocal: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  type: string;
  status: 'PENDING' | 'RESOLVED' | 'TRACKING';
  content: string;
  solutions: string[];
  matchScore: number;
}

export interface WarehouseItem {
  id: string;
  name: string;
  brand: string;
  spec: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  health: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  price: number;
}

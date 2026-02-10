
export interface ServiceModel {
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export interface ExpertiseArea {
  title: string;
  description: string;
  impact: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

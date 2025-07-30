import { Timestamp } from 'firebase/firestore';

export interface User {
  address: string;
}

export interface Contributor {
  address: string;
  amount: number;
  timestamp: number;
}

export interface Contribution {
  id: string; // Document ID from Firestore
  amount: number;
  contributorAddress: string;
  timestamp: Timestamp; // Firestore server timestamp will be used
}

export interface Wish {
  id: string; // Document ID from Firestore
  creatorAddress: string;
  name: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  createdAt?: Timestamp; // Firestore Server Timestamp
  contributors?: Contributor[]; // Add this field
}

// For creating a new wish, we don't have the id etc.
export type NewWish = Omit<Wish, 'id' | 'creatorAddress' | 'currentAmount' | 'createdAt'>;
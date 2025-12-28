import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../firebaseConfig';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    // 1. ADDED: Loading and Error states
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            get();
        } else {
            setData([]);
            setLoading(false);
        }
    }, [user]);

    // Helper to sort data by date (descending) locally
    // This ensures the UI stays sorted even after manual updates without re-fetching
    const sortData = (items) => {
        return items.sort((a, b) => {
             // Assuming 'date' is a Firestore Timestamp or ISO string
             // If Timestamp: a.date.seconds - b.date.seconds
             // If String: new Date(a.date) - new Date(b.date)
             // Generic string compare below (works for ISO strings):
             return new Date(b.date) - new Date(a.date);
        });
    };

    async function get() {
        setLoading(true);
        setError(null);
        try {
            const q = query(
                collection(db, 'users', user.uid, 'transactions'),
                orderBy('date', 'desc')
            );
            const snap = await getDocs(q);
            const fetchedData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setData(fetchedData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    }

    async function save(item) {
      console.log(item);
        setError(null);
        try {
            const ref = collection(db, 'users', user.uid, 'transactions');
            const { id, ...payload } = item;

            if (id) {
                // Update existing
                await updateDoc(doc(db, 'users', user.uid, 'transactions', id), payload);
                setData(prev => {
                    const updatedList = prev.map(i => (i.id === id ? { id, ...payload } : i));
                    return sortData(updatedList); // Keep it sorted
                });
            } else {
                // Add new
                const docRef = await addDoc(ref, payload);
                setData(prev => {
                    const newList = [{ id: docRef.id, ...payload }, ...prev];
                    return sortData(newList); // Keep it sorted
                });
            }
        } catch (err) {
            console.error("Error saving data:", err);
            setError("Failed to save transaction.");
            throw err; // Re-throw so the UI component knows it failed
        }
    }

    async function remove(id) {
        setError(null);
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
            setData(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            console.error("Error deleting data:", err);
            setError("Failed to delete transaction.");
        }
    }

    return (
        // 2. EXPOSED: loading and error to the value
        <DataContext.Provider value={{ data, loading, error, save, remove }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
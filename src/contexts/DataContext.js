import React, { createContext, useState, useEffect, useContext } from 'react';
// 1. Import specific functions from the modular SDK
import { 
    getFirestore, 
    collection, 
    doc, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy 
} from '@react-native-firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Initialize the Firestore instance
    const db = getFirestore();

    useEffect(() => {
        if (!user) {
            setData([]);
            setLoading(false);
            return;
        }

        // 3. Create references and queries using modular functions
        const transactionsRef = collection(db, 'users', user.uid, 'transactions');
        const q = query(transactionsRef, orderBy('date', 'desc'));

        // Real-time listener
        const subscriber = onSnapshot(q, (querySnapshot) => {
            const transactions = [];
            
            querySnapshot.forEach(documentSnapshot => {
                transactions.push({
                    ...documentSnapshot.data(),
                    id: documentSnapshot.id,
                });
            });
            
            setData(transactions);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, [user]);

    async function save(item) {
        const { id, ...payload } = item;
        
        // 4. Update Write operations
        if (id) {
            // Update existing document
            const docRef = doc(db, 'users', user.uid, 'transactions', id);
            await updateDoc(docRef, payload);
        } else {
            // Add new document
            const collectionRef = collection(db, 'users', user.uid, 'transactions');
            await addDoc(collectionRef, payload);
        }
    }

    async function remove(id) {
        // 5. Update Delete operation
        const docRef = doc(db, 'users', user.uid, 'transactions', id);
        await deleteDoc(docRef);
    }

    return (
        <DataContext.Provider value={{ data, loading, save, remove }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
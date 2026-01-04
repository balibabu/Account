import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Saves any JavaScript object/array/value to AsyncStorage
 * @param {string} key 
 * @param {any} value - The object or value to store
 */
export const saveData = async (key, value) => {
    try {
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
        console.error(`Error saving data [Key: ${key}]:`, error);
    }
};

/**
 * Loads and parses data from AsyncStorage
 * @param {string} key 
 * @returns {any|null} The parsed object or null if not found
 */
export const loadData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error(`Error loading data [Key: ${key}]:`, error);
        return null;
    }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key 
 * @returns {any|null}
 */
export const deleteData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error(`Error removing data [Key: ${key}]:`, error);
    }
}


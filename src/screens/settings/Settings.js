import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
// 1. IMPORT 'reload' here
import { 
  getAuth, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  updateProfile,
  reload 
} from '@react-native-firebase/auth';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const auth = getAuth();

  // --- State ---
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  
  // 2. LOCAL DISPLAY NAME STATE
  // We initialize this with the user's name. This ensures that when we update it,
  // the UI reflects it immediately without waiting for the AuthContext to refresh.
  const [displayName, setDisplayName] = useState(user?.displayName || 'User');

  // Keep local state in sync if the context user changes elsewhere
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  // --- Logic: Change Password ---
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
        Alert.alert('Error', 'Password should be at least 6 characters');
        return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      Alert.alert('Success', 'Password updated successfully!');
      setPwdModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Current password is incorrect.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Logic: Update Display Name ---
  const handleUpdateName = async () => {
      if(!newName.trim()) {
          Alert.alert("Error", "Name cannot be empty");
          return;
      }
      setLoading(true);
      try {
          // Update the displayName in Firebase
          await updateProfile(auth.currentUser, { displayName: newName });
          
          // 3. FIX DEPRECATION WARNING
          // Use the modular 'reload' function instead of auth.currentUser.reload()
          await reload(auth.currentUser);

          // 4. UPDATE UI INSTANTLY
          setDisplayName(newName);
          
          Alert.alert("Success", "Profile name updated!");
          setNameModalVisible(false);
      } catch (error) {
          Alert.alert("Error", error.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {/* Use local displayName state here */}
              {displayName ? displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.nameEditContainer} 
            onPress={() => {
                setNewName(displayName); // Pre-fill with current local name
                setNameModalVisible(true);
            }}
          >
            {/* Use local displayName state here */}
            <Text style={styles.username}>{displayName || 'Set your name'}</Text>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
          
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => setPwdModalVisible(true)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔒</Text>
            </View>
            <Text style={styles.menuText}>Change Password</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]} 
            onPress={logout}
          >
             <View style={[styles.iconContainer, styles.logoutIconBg]}>
              <Text style={styles.icon}>🚪</Text>
            </View>
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Made by Keshav with ❤️</Text>
        </View>

      </ScrollView>

      {/* Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pwdModalVisible}
        onRequestClose={() => setPwdModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Retype new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setPwdModalVisible(false)}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleChangePassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextSave}>Update</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Name Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={nameModalVisible}
        onRequestClose={() => setNameModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile Name</Text>
            
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={newName}
              onChangeText={setNewName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setNameModalVisible(false)}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleUpdateName} disabled={loading}>
                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextSave}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4a148c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  nameEditContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
      fontSize: 18,
      color: '#4a148c',
      marginLeft: 8,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 18,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#FF5252',
  },
  logoutIconBg: {
    backgroundColor: '#FFEBEE',
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 20, 
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    opacity: 0.1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: '#4a148c',
    marginLeft: 10,
  },
  btnTextCancel: {
    color: '#333',
    fontWeight: 'bold',
  },
  btnTextSave: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
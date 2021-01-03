/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from '../database/firebaseDB';

const db = firebase.firestore().collection('messages');
const auth = firebase.auth();

function logout() {
  auth.signOut();
}

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // This is the listener for authentication
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Chat');
      } else {
        navigation.navigate('Login');
      }
    });

    // This sets up the top right button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="black"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });

    // This loads data from firebase
    const unsubscribeSnapshot = db.orderBy('createdAt', 'desc').onSnapshot((collectionSnapshot) => {
      const serverMessages = collectionSnapshot.docs.map((doc) => {
        const data = doc.data();
        // eslint-disable-next-line no-console
        console.log(data);
        const returnData = {
          ...doc.data(),
          createdAt: new Date(data.createdAt.seconds * 1000), // convert to JS date object
        };
        return returnData;
      });
      setMessages(serverMessages);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  function sendMessages(newMessages) {
    // eslint-disable-next-line no-console
    console.log(newMessages);
    const newMessage = newMessages[0];
    db.add(newMessage);
    // setMessages([...newMessages, ...messages]);
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => sendMessages(newMessages)}
      renderUsernameOnMessage
      listViewProps={{
        style: {
          backgroundColor: '#666',
        },
      }}
      user={{
        _id: 1,
      }}
    />
  );
}

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
	apiKey: 'AIzaSyCsEKbNsETQRBicu4MIw0alHQ4bpG-gRCc',
	authDomain: 'ranklist-c95ac.firebaseapp.com',
	projectId: 'ranklist-c95ac',
	storageBucket: 'ranklist-c95ac.appspot.com',
	messagingSenderId: '737206645568',
	appId: '1:737206645568:web:2eab4951911e6ee77500a5',
}

export const firebaseApp = initializeApp(firebaseConfig)

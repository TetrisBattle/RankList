import { initializeApp } from 'firebase/app'

const firebaseConfig = {
	apiKey: "AIzaSyAQyakRnqI-Tk6uBMZhjLe_xXv0BFxiV34",
	authDomain: "ranklist-a7d02.firebaseapp.com",
	projectId: "ranklist-a7d02",
	storageBucket: "ranklist-a7d02.appspot.com",
	messagingSenderId: "1023763704912",
	appId: "1:1023763704912:web:2479f16655dbb246fcf555",
	measurementId: "G-JMLGRX42GY"
}

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp

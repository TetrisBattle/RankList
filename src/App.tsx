import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import RootWrapper from 'components/RootWrapper'
// import Login from 'pages/Login'
import Manga from 'pages/Manga'

export default function App() {
	return (
		<Router>
			<RootWrapper>
				<Routes>
					<Route path='/' element={<Navigate replace to={'/manga'} />} />
					{/* <Route path='/Login' element={<Login />} /> */}
					<Route path='/Manga' element={<Manga />} />
				</Routes>
			</RootWrapper>
		</Router>
	)
}

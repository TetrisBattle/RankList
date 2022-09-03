import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import RootWrapper from 'components/RootWrapper'
import Home from 'pages/Home'
import Manga from 'pages/Manga'

export default function App() {
	return (
		<Router>
			<RootWrapper>
				<Routes>
					<Route path='/' element={<Navigate replace to='/Manga' />} />
					<Route path='/Home' element={<Home />} />
					<Route path='/Manga' element={<Manga />} />
				</Routes>
			</RootWrapper>
		</Router>
	)
}

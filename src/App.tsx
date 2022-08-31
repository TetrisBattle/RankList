import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import RootWrapper from 'components/RootWrapper'
import Home from 'pages/Home'
import About from 'pages/About'

export default function App() {
	return (
		<Router>
			<RootWrapper>
				<Routes>
					<Route path='/' element={<Navigate replace to='/Home' />} />
					<Route path='/Home' element={<Home />} />
					<Route path='/About' element={<About />} />
				</Routes>
			</RootWrapper>
		</Router>
	)
}

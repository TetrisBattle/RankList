import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<Box
			className='login'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
			}}
		>
			<Box display={'flex'} flexDirection={'column'} gap={2} p={4}>
				<Typography variant='h1' textAlign={'center'} fontSize={40}>
					Log In
				</Typography>
				<TextField
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					label={'Email'}
					color={'info'}
					size={'small'}
				/>
				<TextField
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					label={'Password'}
					type={'password'}
					color={'info'}
					size={'small'}
				/>
				<Button>Log In</Button>
			</Box>
		</Box>
	)
}

export default Login

'use client'
import theme from '@/lib/theme'
import { Container } from '@mui/material'
import { keyframes } from '@emotion/react';
import { useEffect } from 'react'
import { FidgetSpinner, InfinitySpin } from 'react-loader-spinner'
import Image from 'next/image'
import logo from './logoChartreux.png'

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	// useEffect(() => {
	// 	setTimeout(() => { }, 1000)
	// }, [])
	return (
		<Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<Image src={logo} alt="logo" width="300" height="300"
			/>
			{/* <FidgetSpinner
				visible={true}
				height="200"
				width="200"
				ariaLabel="loading"
				wrapperStyle={{}}
				wrapperClass="loading"
				ballColors={[theme.palette.secondary.main, theme.palette.secondary.main, theme.palette.secondary.main]}
				backgroundColor={theme.palette.primary.main}
			/> */}
		</Container>
	)
}

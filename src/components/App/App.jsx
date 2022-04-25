import React, { useEffect, useState } from 'react'
import axios from 'axios'

import cl from './App.module.css'

const App = () => {
	const [photos, setPhotos] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [isFetching, setIsFetching] = useState(true)
	const [totalCount, setTotalCount] = useState(0)

	useEffect(() => {
		if (isFetching) {
			axios
				.get(
					`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`
				)
				.then(response => {
					setPhotos([...photos, ...response.data])
					setCurrentPage(prevPage => prevPage + 1)
					setTotalCount(response.headers['x-total-count'])
				})
				.finally(() => setIsFetching(false))
		}
	}, [isFetching])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler)
		return function() {
			document.removeEventListener('scroll', scrollHandler)
		}
	}, [])

	const scrollHandler = e => {
		const totalHeight = e.target.documentElement.scrollHeight
		const currentScrollHeight = e.target.documentElement.scrollTop
		const visibleHeight = window.innerHeight

		if (
			totalHeight - (currentScrollHeight + visibleHeight) < 100 &&
			photos.length === totalCount
		) {
			setIsFetching(true)
		}
	}

	return (
		<div className={cl.app}>
			<div className={cl.photos}>
				{photos.length ? (
					photos.map(({ id, title, thumbnailUrl }) => (
						<div className={cl.photo} key={id}>
							<div className={cl.title}>
								{id}. {title}
							</div>
							<img src={thumbnailUrl} alt={title} />
						</div>
					))
				) : (
					<p>Идет загрузка...</p>
				)}
			</div>
		</div>
	)
}

export default App

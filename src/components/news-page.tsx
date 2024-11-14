'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { NewsItem } from '@/types/news'
import NewsGrid from './news-grid'

const PAGE_SIZE = 10

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchNews = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const response = await fetch(`/api/news?page=${page}&pageSize=${PAGE_SIZE}`)
      const data = await response.json()
      setNews((prevNews) => [...prevNews, ...data.news])
      setHasMore(data.news.length === PAGE_SIZE)
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading])

  useEffect(() => {
    fetchNews()
  }, [])

  const lastNewsElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNews()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore, fetchNews]
  )

  const handleNewsClick = (item: NewsItem) => {
    // Handle news item click (e.g., navigate to news detail page)
    console.log('Clicked news item:', item)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NewsGrid news={news} onNewsClick={handleNewsClick} hasMore={hasMore} />
      {loading && <div className="text-center mt-4">Loading...</div>}
      <div ref={lastNewsElementRef} />
    </div>
  )
}

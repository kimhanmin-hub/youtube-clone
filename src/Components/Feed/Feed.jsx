import React, { useState, useEffect, useRef } from 'react'
import './Feed.css'
import { Link } from 'react-router-dom'
import { API_KEY, value_converter, formatTimeAgo } from '../../data'

const Feed = ({category}) => {
    const [data, setData] = useState([])
    const previewRef = useRef(null);
    const timeoutRef = useRef(null);
    
    const fetchData = async () => {
        const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=100&regionCode=KR&videoCategoryId=${category}&key=${API_KEY}`
        try {
            const response = await fetch(videoList_url);
            const result = await response.json();
            setData(result.items);
        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [category])

    const handleMouseEnter = (videoId, event) => {
        const card = event.currentTarget;
        const cardRect = card.getBoundingClientRect();

        timeoutRef.current = setTimeout(() => {
            previewRef.current.style.display = 'block';
            previewRef.current.style.left = `${cardRect.left}px`;
            previewRef.current.style.top = `${cardRect.top + cardRect.height}px`;
            previewRef.current.innerHTML = `<img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="Preview" />`;
        }, 1000); // 1초 후에 미리보기 표시
    }

    const handleMouseLeave = () => {
        clearTimeout(timeoutRef.current);
        if (previewRef.current) {
            previewRef.current.style.display = 'none';
        }
    }

    return (
        <>
            <div className="feed"> 
                {data.map((item, index) => (
                    <Link 
                        to={`/video/${category}/${item.id}`} 
                        className='card' 
                        key={item.id}
                        onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                        <h2>{item.snippet.title.length > 30 ? item.snippet.title.slice(0, 30) + "..." : item.snippet.title}</h2>
                        <h3>{item.snippet.channelTitle}</h3>
                        <p>{value_converter(item.statistics.viewCount)}회 • {formatTimeAgo(item.snippet.publishedAt)}</p>
                    </Link>
                ))}
            </div>
            <div ref={previewRef} className="video-preview" style={{display: 'none', position: 'fixed', zIndex: 1000}}></div>
        </>
    )
}

export default Feed

import React, { useEffect, useRef, useState } from "react"
import './ShowList.css'
import axiosInstance from "../common/server.js"
import CreatePlaylist from "../CreatePlaylist/CreatePlaylist"
import { useNavigate } from "react-router-dom"
import Carousel, { CarouselItem } from "../carousel/Carousel"

function ShowList(props) {

    const [userPlaylists,setUserPlaylists] = useState('')
    const [trendingPlaylists,setTrendingPlaylists] = useState('')
    const [CreatePlaylistModal, setCreatePlaylistModal] = useState("")
    const [sort, setSort] = useState("Relevance")
    const CreatePlaylistModalRef = useRef(null)
    const [playlistID, setPlaylistID] = useState(undefined)

    const navigate = useNavigate()

    const toggleDropdown = () => {
        console.log('show modal')
        setCreatePlaylistModal("show")
    }

    const selectPlaylist = (event) => {
        console.log(event.target.value)
        setPlaylistID(event.target.value)
        navigate('/playlistPage',{state:{ID:parseInt(event.target.value,10)}})
    }

    useEffect(()=> {
        async function fetchUserPlaylists() {
            const response = await axiosInstance({
                method: 'post',
                url: `/listPlaylistsBy${sort}`,
                headers: {}, 
                data: {
                    accountID: props.accountID,
                    ID: props.ID
                }
              })
            let val = response.data
            setUserPlaylists(val)
        }

        async function fetchTrendingPlaylists() {
            const response = await axiosInstance({
                method: 'post',
                url: `/listPlaylists`,
                headers: {}, 
              })
            let val = response.data
            setTrendingPlaylists(val)
        }

        const run = (async () => {
            await fetchUserPlaylists()
            await fetchTrendingPlaylists()
        })

        run()
    },[sort])



    return (
        <div className="container-center-horizontal">
          <div className="user-page">
            <div className="outer-container">
              <div className="inner-container">
              <div className="overlap-container">
                  <div className="playlist-name-container">
                    <span className="playlists"> Em Alta</span>
                  </div>
                  <div className="carousel-container">
                  <Carousel>
                      {trendingPlaylists ? trendingPlaylists.map(el => <CarouselItem key={el.id} itemPath='/PlaylistPage' value={el.id}> {el} </CarouselItem>) : <CarouselItem> no playlist</CarouselItem>}
                  </Carousel>
                  </div>
                </div>
                <div className="overlap-container">
                  <div className="playlist-name-container">
                    <span className="playlists">Suas Playlists</span>
                  </div>
                  <div className="carousel-container">
                  <Carousel>
                      {userPlaylists ? userPlaylists.map(el => <CarouselItem key={el.id} itemPath='/PlaylistPage' value={el.id}> {el} </CarouselItem>) : <CarouselItem> no playlist</CarouselItem>}
                  </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default ShowList

{/* <div>
            <CreatePlaylist accountID={props.accountID} modalController={CreatePlaylistModal} openModal={setCreatePlaylistModal} modalRef ={CreatePlaylistModalRef} categories = {['teste', 'teste 2', 'teste 3']} />
        </div> */}
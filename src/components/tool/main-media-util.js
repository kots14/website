import React, {useState, useEffect} from "react"
import tw, { css } from "twin.macro"
import ReactPlayer from "react-player/lazy"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import {
  SliderContentImageStyle, 
  SliderStyle, 
  SliderContentStyle,
  getSliderSetting,
  parseVideo
} from "./main-media-util-helper"

const getVideoThumbnailUrl = async url => {
  const video = parseVideo(url)
  if (video.type === "youtube")
    return video.id ? "https://img.youtube.com/vi/" + video.id + "/maxresdefault.jpg" : "#"
  if (video.type === "vimeo") {
    const fetched = (async videoId => {
      let result = {}
      try {
        const response = await fetch("https://vimeo.com/api/v2/video/" + videoId + ".json")
        result = await response.json()
        return result[0].thumbnail_large
      } catch (e) {
        console.error("Error while fetching Vimeo video data", e)
      }
    })
    return fetched(video.id)
  }
}

const renderMainMediaDisplayElement = {
  video: video => {
    return (
      <div tw="h-full text-center" key={video.key} id={video.key} css={video.css}>
        <ReactPlayer url={video.url} width="100%" controls={true}/>
      </div>
    )
  },
  image: image => (
    <a href={image.url} tw="w-full text-center" css={image.css}
    key={image.key} id={image.key}>
      <img
        alt={`Screenshot of ${image.name} website`}
        tw="border-4 max-w-full inline-block"
        src={image.src}
      />
    </a>
  ),
}

const renderMainMediaSliderElement = {
  video: video => {
    const src = video.thumbnailSrc || "#"
    return (
      <div css={[SliderContentStyle]} 
      id={video.key}
      key={video.key}
      onClick={video.onClick}>
        <img 
        alt={`Thumbnail`}
        src={src}
        id={video.key + "_img"}
        css={[
          tw`border-4 max-w-full`,
          SliderContentImageStyle
        ]}
        />
      </div>
    )
  },
  image: image => {
    
    return (
      <div css={[SliderContentStyle]} 
      id={image.key}
      key={image.key}
      onClick={image.onClick}>
        <img 
        alt={`Screenshot of ${image.name} website`}
        src={image.src}
        css={[
          tw`border-4 max-w-full`,
          SliderContentImageStyle
        ]}
        />
      </div>
    )
    
  }
}

const WrappedImage = props => (
  <div css={props.divCSS} 
  id={props.key}
  key={props.key}
  onClick={props.onClick}>
    <img 
    alt={props.alt}
    id={props.imgId}
    src={props.src}
    css={props.imgCSS}
    />
  </div>
)
export const MainMediaUtil = ({data}) => {
  const [items] = useState(data)
  const [index, setIndex] = useState(0)
  const [areThumbnailsRendered, setAreThumbnailsRendered] = useState(false)
  const sliderSetting = getSliderSetting(items.length)

  const toggleDisplayStatusOfElement = options => {
    options = options || {}
    const idForElementToDisplay = "#main_media_util_in_display_" + index
    const idForElementToFocus = "#main_media_util_" + index
    const elementToDisplay = document.querySelector(idForElementToDisplay)
    const elementToFocus = document.querySelector(idForElementToFocus)
    elementToDisplay.setAttribute('style', options.style || 'display:block')
    elementToFocus.focus()
  }

  const populateVideoThumbnails = async () => {
    items.map(async item => {
      if (item.type !== "video") return
      const url = await getVideoThumbnailUrl(item.source.url)
      const target = document.querySelector("#" + item.source.key + "_img")
      target.setAttribute("src", url)
    })
    
    setAreThumbnailsRendered(true)
  }

  useEffect(() => {
    if (items.length > 1) toggleDisplayStatusOfElement()
    if (!areThumbnailsRendered) populateVideoThumbnails()
  })
  
  return items.length > 1 ? (
    <>
      <div tw="items-center h-full mb-1">
        {items.map((item, itemIndex) => {
          item.source.key = "main_media_util_in_display_" + itemIndex
          item.source.css = css`display:none;`
          return renderMainMediaDisplayElement[item.type](item.source)
        })}
      </div>
      <div tw="items-center h-full ml-2 mr-2">
        <Slider {...sliderSetting} css={[SliderStyle]}>
          {items.map((item, itemIndex) => {
            item.source.key = "main_media_util_" + itemIndex 
            item.source.onClick = () => { 
              if (itemIndex === index) return
              toggleDisplayStatusOfElement({style : 'display:none' })
              setIndex(itemIndex) 
            }
            return renderMainMediaSliderElement[item.type](item.source)
          })}
        </Slider>
      </div>
    </>
  ) : (
    <div tw="flex justify-center items-center h-full mb-5 pb-4">
      {items.map(item => {
        item.source.key = "main_media_util_in_display_0"
        return renderMainMediaDisplayElement[item.type](item.source)
      })}
    </div>
  )
}
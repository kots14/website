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
  getSliderSetting
} from "./main-media-util-settings"

const renderMainMediaDisplayComponent = {
  video: video => (
    <div key={video.key} id={video.key} css={video.css}>
      <ReactPlayer url={video.url} width="100%" controls={true}  />
    </div>
  ),
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

const getThumbnailUrl = url => {
  if (url.includes("youtube.com")) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length === 11? match[7] : false;
    return videoId ? "https://img.youtube.com/vi/" + videoId + "/default.jpg" : "#"
  }
}

const renderMainMediaSliderElements = {
  video: video => {
    return (
      <div css={[SliderContentStyle]} 
      id={video.key}
      key={video.key}
      onClick={video.onClick}>
        <img 
        alt={`Thumbnail`}
        src={getThumbnailUrl(video.url)}
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

export const MainMediaUtil = ({data}) => {
  const [items] = useState(data);
  const [index, setIndex] = useState(0);
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

  useEffect(() => {
    if (items.length > 1) toggleDisplayStatusOfElement()
  })
  
  return items.length > 1 ? (
    <>
      <div tw="items-center h-full mb-1">
        {items.map((item, itemIndex) => {
          item.source.key = "main_media_util_in_display_" + itemIndex
          item.source.css = css`display:none;`
          return renderMainMediaDisplayComponent[item.type](item.source)
        })}
      </div>
      <div tw="items-center h-full pr-5">
        <Slider {...sliderSetting} css={[SliderStyle]}>
          {items.map((item, itemIndex) => {
            item.source.key = "main_media_util_" + itemIndex 
            item.source.onClick = () => { 
              if (itemIndex === index) return
              toggleDisplayStatusOfElement({style : 'display:none' })
              setIndex(itemIndex) 
            }
            return renderMainMediaSliderElements[item.type](item.source)
          })}
        </Slider>
      </div>
    </>
  ) : (
    <div tw="flex justify-center items-center h-full mb-5 pb-4">
      {items.map(item => {
        item.source.key = "main_media_util_in_display_0"
        return renderMainMediaDisplayComponent[item.type](item.source)
      })}
    </div>
  )
}
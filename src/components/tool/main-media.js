import React, {useState} from "react"
import tw, { css } from "twin.macro"
import ReactPlayer from "react-player/lazy"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"

const getVideo = resources => {
  if (!resources) {
    return
  }
  for (let i = 0; i < resources.length; i++) {
    let item = resources[i]
    if (item.url.includes("youtube.com") || item.url.includes("vimeo.com")) {
      return item
    }
  }
}

const renders = {
  video: video => (
    <ReactPlayer tw="max-w-full" url={video.url} width="100%" controls={true} />
  ),
  image: image => (
    <a href={image.url} tw="w-full text-center">
      <img
        alt={`Screenshot of ${image.name} website`}
        tw="border-4 max-w-full inline-block"
        src={image.src}
        height="360"
      />
    </a>
  ),
}

const MainMedia = ({ tool }) => {
  const { name, homepage, resources } = tool
  let screenshot = { name, url: homepage, src: tool.fields.screenshot }
  let video = getVideo(resources)
  const items = []

  if (screenshot) {
    items.push({ type: "image", source: screenshot })
  }

  if (video) {
    items.push({ type: "video", source: video })
  }

  return (
    <div tw="mb-5">
      {items.length > 1 ? (
        <div tw="items-center h-full pr-4 pl-4">
          <MediaElement data={items} />
        </div>
      ) : (
        <div tw="flex justify-center items-center h-full mb-5 pb-4">
          {renders[items[0].type](items[0].source)}
        </div>
      )}
    </div>
  )
}

const imageStyles = css`
    height: inherit;  
    margin-left: auto;  
    margin-right: auto;  
  `
const sliderStyles = css`
    .slick-prev:before,
    .slick-next:before {
      color: #222425!important;
    }
    .slick-slide {
      padding: 0rem 1rem 0rem 1rem;
    }
  `
const sliderContentStyle = css`
    margin: 1rem 0rem 1rem 0.1rem;
    transition: transform .2s;
    height: 8rem;
    background: #f7f7f7;
    text-align: center;
    cursor: pointer;
    border-radius: 0.5rem;

    &:hover {
      -ms-transform: scale(1.005);
      -webkit-transform: scale(1.005);
      transform: scale(1.005);
    }

    &:focus {
      outline: none;
      -webkit-box-shadow: 0px 0px 4px 0px rgba(173,173,173,1);
      -moz-box-shadow: 0px 0px 4px 0px rgba(173,173,173,1);
      box-shadow: 0px 0px 4px 0px rgba(173,173,173,1);
    }
  `  
// TODO : get Thumbnail Url for vimeo videos  
const getThumbnailUrl = url => {
  if (url.includes("youtube.com")) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length === 11? match[7] : false;
    return videoId ? "https://img.youtube.com/vi/" + videoId + "/default.jpg" : "#"
  }
}

//TODO : refactor render Slider Elements
const renderSliderElements = {
  video: video => {
    return (
      <div css={[sliderContentStyle]} 
      id={video.key}
      key={video.key}
      onClick={video.onClick}>
        <img 
        alt={`Thumbnail`}
        src={getThumbnailUrl(video.url)}
        css={[
          tw`border-4 max-w-full`,
          imageStyles
        ]}
        />
      </div>
    )
  },
  image: image => {
    
    return (
      <div css={[sliderContentStyle]} 
      id={image.key}
      key={image.key}
      onClick={image.onClick}>
        <img 
        alt={`Screenshot of ${image.name} website`}
        src={image.src}
        css={[
          tw`border-4 max-w-full`,
          imageStyles
        ]}
        />
      </div>
    )
    
  }
}
const MediaElement = ({data}) => {
  const [items] = useState(data);
  const [index, setIndex] = useState(0);
  const maxSlidesToShow = items.length < 3 ? 2 : 3;
  const settings = {
    focusOnSelect: true,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: maxSlidesToShow,
    slidesToScroll: 1,
    responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: maxSlidesToShow,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }
  // TODO : create a onclick function which will hide and show rendered elements based on index
  return (
    <>
      <div tw="flex justify-center items-center h-full mb-1 pb-4">
        {renders[items[index].type](items[index].source)}
      </div>
      <Slider {...settings} css={[sliderStyles]}>
        {items.map((item, itemIndex) => {
          item.source.key = 'media_element_' + itemIndex 
          item.source.onClick = () =>{ setIndex(itemIndex);  }
          return (
            renderSliderElements[item.type](item.source)
          )
        })}
      </Slider>
    </>
  )
}
export default MainMedia

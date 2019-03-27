import React from "react";
import { animated, useTransition } from "react-spring";
import usePrevious from "../../utils/usePrevious";
import styles from "./ImageCarousel.module.css";

interface ImageCarouselProps {
  index: number;
  height: number;
  imageUrls: string[];
  onClick: (imageUrl: string) => void;
}

function ImageCarousel(props: ImageCarouselProps) {
  if (props.imageUrls.length === 0) {
    return <div className={styles.carousel} />;
  }
  return <ImageCarouselInner {...props} />;
}

function ImageCarouselInner(props: ImageCarouselProps) {
  const { index, height, imageUrls, onClick } = props;

  const previousIndex = usePrevious(index, -1);
  const movingToNext = previousIndex < index;

  const transitions = useTransition(imageUrls[index], p => p, {
    from: { opacity: 0, transform: `translate3d(${movingToNext ? 100 : -50}%,0,0)` },
    enter: { opacity: 1, transform: `translate3d(0%,0,0)` },
    leave: { opacity: 0, transform: `translate3d(${movingToNext ? -50 : 100},0,0)` }
  });

  // preload the two images either side of where we are
  const beforeIndex = (imageUrls.length + index - 1) % imageUrls.length;
  const afterIndex = (imageUrls.length + index + 1) % imageUrls.length;
  const linksToPreload = [imageUrls[beforeIndex], imageUrls[afterIndex]];

  return (
    <div className={styles.carousel}>
      {transitions.map(({ item, props, key }) => {
        const onImageClick = () => {
          onClick(item);
        };
        return (
          <animated.div
            key={key}
            className={styles.page}
            onClick={onImageClick}
            style={{ ...props, backgroundImage: `url("${item}")`, height }}
          />
        );
      })}

      {linksToPreload.map(i => (
        <link key={i} rel="preload" as="image" href={i} />
      ))}
    </div>
  );
}

export default ImageCarousel;

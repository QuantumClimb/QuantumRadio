import React from "react";

interface ThumbnailImageProps {
  videoId: string;
  title: string;
  className?: string;
  thumbnailUrl?: string;
}

// YouTube thumbnail quality variants in order of preference
const THUMBNAIL_QUALITIES = [
  "maxresdefault", // 1920x1080
  "sddefault",     // 640x480
  "hqdefault",     // 480x360
  "mqdefault",     // 320x180
  "default"        // 120x90
] as const;

const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
  videoId,
  title,
  className = "",
  thumbnailUrl,
}) => {
  // Use the provided thumbnail URL from the API, or construct a fallback URL
  const imageUrl = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <img
      src={imageUrl}
      alt={title}
      className={className}
    />
  );
};

export default ThumbnailImage; 
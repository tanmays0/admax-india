import { Link } from "react-router-dom";
import { images } from "../constants/images";

const heights = {
  xs: "h-8",
  sm: "h-10",
  md: "h-11",
  lg: "h-12",
  xl: "h-14",
  hero: "h-16",
  nav: "h-[3.25rem]",
};

/**
 * Logo assets stay unchanged (forest/moss mark on white).
 * On dark surfaces we always frame with white so the mark stays readable.
 */
export default function Logo({
  size = "md",
  className = "",
  darkBg = false,
  framed = false,
  linkTo = "/",
  alt = "AdMax India — Your Growth Partner",
}) {
  const img = (
    <img
      src={images.logo}
      alt={alt}
      className={`w-auto max-w-[220px] object-contain object-left ${heights[size]} ${className}`}
    />
  );

  let content = img;
  if (darkBg || framed) {
    content = (
      <span
        className={
          darkBg
            ? "logo-on-dark"
            : "inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-gray-100/90"
        }
      >
        {img}
      </span>
    );
  }

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex shrink-0 items-center">
        {content}
      </Link>
    );
  }

  return content;
}

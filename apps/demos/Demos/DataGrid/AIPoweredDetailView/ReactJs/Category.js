import React from "react";
export default function Category({ data }) {
  const categoryClass = `category__wrapper category-${data?.CategoryID}__bg-color`;
  return <div className={categoryClass}>{data?.CategoryName}</div>;
}

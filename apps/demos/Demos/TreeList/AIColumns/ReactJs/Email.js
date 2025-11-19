import React from 'react';

export default function Email(props) {
  const { Email } = props.data;
  return <a href={`mailto:${Email}`}>{Email}</a>;
}

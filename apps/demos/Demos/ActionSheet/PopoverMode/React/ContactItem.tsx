import React from 'react';

interface ContactItemProps {
  name: string;
  phone: string;
  email: string;
}

export default function RenderContactItem({ name, phone, email }: ContactItemProps) {
  return (
    <div>
      <div>{name}</div>
      <div>{phone}</div>
      <div>{email}</div>
    </div>
  );
}

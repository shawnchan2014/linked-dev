import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function Spinner() {
  return (
    <div>
      <ClipLoader
        // css={{ margin: 'auto', diplay: 'block' }}
        sizeUnit={'px'}
        size={60}
        color={'#393d42'}
      />
    </div>
  );
}

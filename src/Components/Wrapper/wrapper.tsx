import React, { ReactNode } from 'react';
import './wrapper.css';

interface Props {
  children?: ReactNode;
}

const Wrapper: React.FC<Props> = (props: Props) => {
  return (
    <section className={'wrapper '} style={{ color: '#000' }}>
      {props.children}
    </section>
  );
};

export default Wrapper;

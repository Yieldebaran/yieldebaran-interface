import React from 'react';
import './starBpro.css';
import star from '../../assets/icons/rating-star.svg';
import bpro from '../../assets/images/BPRO-logo.svg';
import ReactTooltip from 'react-tooltip';
import { useEffect } from 'react';

interface Props {
    active: boolean;
    backstop: boolean;
}

const StarBpro: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        ReactTooltip.rebuild();
    });

    return props.active && props.backstop ? (
        <div className="star-bpro star-bpro-icons">
            <img src={bpro} />
            <img src={star} />
        </div>
    ) : props.active ? (
        <div className="star star-bpro-icons">
            <img src={star} />
        </div>
    ) : props.backstop ? (
        <div className="bpro star-bpro-icons">
            <img src={bpro} data-tip data-for="BPRO" />

            <ReactTooltip id="BPRO" place="top" effect="solid" delayHide={100} delayShow={100} delayUpdate={100}>
                <p>
                    Green logo indicates markets integrated with a backstop provision.</p>
                    <p>
                    Learn about backstop{' '}
                    <a
                        className="a"
                        href="https://docs.hundred.finance/core-protocol/backstop-provision"
                    >
                        here
                    </a>{' '}
                </p>
            </ReactTooltip>
            
        </div>
    ) : (
        <></>
    );
};

export default StarBpro;

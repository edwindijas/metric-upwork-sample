import React, { useState } from 'react';
import styled from 'styled-components';
import { IconCheck } from '../Icons/Check';
import { IconMinus } from '../Icons/Minus';

export const CheckBox = (props: iCheckBox ) => {
    const [active, setActive] = useState<boolean>(false);

    let finalActive = !props.manage ? !!props.selected : active;

    return <ElCheckBox active = {props.mildSelect || finalActive} onClick = { () => {
        if (props.manage) {
            setActive(active =>{
                props.onChange(!active);
                return !active;
            })
        } else {
            props.onChange(!props.selected);
        }
        
    }} >
        {!props.mildSelect && <IconCheck />}
        {props.mildSelect && <IconMinus />}
    </ElCheckBox>
}

const ElCheckBox = styled.div`
    border: 1px solid #ccc;
    width: 1.5em;
    height: 1.5em;
    padding: 0.3em;
    line-height: 0;
    border-radius: 0.25em;
    transition: fill 0.5s, border-color: 0.5s;
    cusror: pointer;
    ${(props: {active: boolean}) => {
        const borderColor = props.active ? 'blue' : '#ddd';
        return `
        border-color: ${borderColor};
        fill: ${borderColor};
        `;
    }}
`;




type tChange =  (value: boolean | undefined) => void | boolean

interface iCheckBox {
    onChange: tChange;
    checked?: boolean;
    manage?: boolean;
    selected?: boolean;
    mildSelect?: boolean;
}


import React, { ChangeEvent, Dispatch, FocusEventHandler, SetStateAction, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export const CustomInput = (props: iPropTypes) => {
    let defaultState = props.defaultValue ? 2 : 0;

    const [state, setState] = useState<number>(defaultState);
    const refItem = useRef<HTMLInputElement>(null);
    const type = props.type || 'text';

    if (props.defaultValue !== undefined && props.onChange) {
        props.onChange(props.defaultValue);
    }

    let error = props.errors && ((props.name && props.errors[props.name]) ||  (props.label && props.errors && props.errors[props.label]));

    useEffect (() => {
        
        if (!refItem.current) {
            return;
        }

        let state = refItem.current.value.length > 0  ? 2 : 0;
        if (refItem.current === document.activeElement) {
            state = 1;
        }
        if (error) {
            state = 3;
        }

        setState(state);

    }, [props.errors])

    

    return <EleFieldset onClick = { (e: React.MouseEvent<HTMLFieldSetElement>) => { e.preventDefault() ; if (refItem.current) refItem.current.focus()} } >
        <ElLblInput >
            <EleLabel state = {state} > { props.label } </EleLabel>
            <EleInputSpace >
                { Array(4).fill(0).map( (value, index) => fullBorder(state, index)) }
                <EleInput type = { type } state = {state}  defaultValue = {props.defaultValue} ref = {refItem} onKeyDown = { keyDown (props.acceptType) }  onChange = { onChange(props.onChange) } onBlur = {onBlur(setState)} onFocus = {() => setState(1)} />
            </EleInputSpace>
        </ElLblInput>
        
        { error &&
            <ElError >
                { error }
            </ElError>
        }
    </EleFieldset>
}

type tRegex = (name: string) => boolean

export const keyDown = (acceptType: string | undefined) => {

    const matchTests: {[name: string]: tRegex} = {
        "integer": value => /^[0-9]+$/.test(value),
        "float": value => /^[0-9]+\.?[0-9]*$/.test(value),
        "chars": value => /^[A-Za-z0-9]+$/.test(value),
    }

    //'string' | 'chars' | 'float' | 'integer' | 'boolean';

    return (e: React.KeyboardEvent) => {
        if (!acceptType || e.key.length > 1) {
            return;
        }

        let next = (e.target as HTMLInputElement).value + e.key;
        console.log(acceptType, next, matchTests[acceptType](next) )
        if (matchTests[acceptType] && matchTests[acceptType](next) ) {
            return;
        }

        e.preventDefault();

    }
}

export const dataHandler = (data: iDataHandler, name: string, setError: Dispatch<SetStateAction<iErrors>> | undefined = undefined, validator: tValidator | undefined = undefined) => {
    return (value: string | undefined) => {
        data[name] = value || data[name];

        if (validator && setError) {
            //errors[name] = validator(data[name]);
            setError((currentState: iErrors) => {
                const newState = {...currentState};
                newState[name] = validator(data[name]);
                return newState;
            });
        }

    }
}




const onChange = (
    setValue: iChange | undefined = undefined) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.value.trim();

        if (setValue && typeof setValue === 'function') {
            setValue(value);
        }
    }
}

const onBlur = ( setState: Dispatch<SetStateAction<number>> ): FocusEventHandler<HTMLInputElement> => {
    return  (event: React.FocusEvent<HTMLInputElement>) => {
        const target = event.target;
        const {value} = target;

        let state = 0;
        if (value.trim() !== '') {
            state = 2;
        }
        setState(state);
    }
}


const fullBorder = (state: number, num: number) => <EleBorder key = { num } >
    <EleBorderContent state = { state } num = { num + 1 } ></EleBorderContent>
</EleBorder>

const transDelay = 0.3;

const colors = ['#858a8e', '#2196f3', 'brown', 'red'];

const EleInput = styled.input`
    display: block;
    width: 100%;
    height: 3em;
    padding: 0 0.75em;
    outline: none;
    border-radius: 0.35em;
    transition: background-color ${transDelay}s, color ${transDelay}s;
    background-color: ${(props: iPropsLabel) => props.state > 0 ? "#fff" : "#eee" };
    position: relative;
    z-index: 5;
    &:-webkit-autofill {
        box-shadow: inset 100em 100em 10em #fff;
    }
`;

const EleLabel = styled.label`
    position: absolute;
    margin: auto 0;
    height: max-content;
    left: 0.75em;
    padding: 0 0.25em;
    text-transform: capitalize;
    background-color: #eee;
    z-index: 6;
    color: #2b4458;
    transition: background-color ${transDelay}s, color ${transDelay}s;
    border-radius: 0.25em 0.25em 0 0 ;
    ${(props: iPropsLabel) => {
        const { state } = props;
        
        const bottom =  state > 0 ? 'auto' : 0;
        const top =  state > 0 ? '-0.5em' : 0;
        const color = state > 0 ? "#fff" : "#eee";
        return `
            bottom: ${bottom};
            top: ${top};
            color: ${ colors[state] };
            background-color: ${color};
        `;
    }}
`;

const EleFieldset = styled.fieldset`
    position: relative;
    padding: 0.5em 0;
`;

const EleInputSpace = styled.div`
    position: relative;
    padding: 2px;
    overflow: hidden;
    border-radius: 0.5em;
`;


const EleBorder = styled.div`
    height: 4px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    &:nth-child(2n) {
        height: 100%;
        width: 4px;
    }

    &:nth-child(2) {
        left: auto;
        right: 0;
    }

    &:nth-child(3) {
        top: auto;
        bottom: 0;
        > div {
            margin: 0 0 0 auto;
        }
    }

    &:nth-child(4) {
        > div {
            position: absolute;
            bottom: 0;
        }
       
    }
`;


const ElLblInput = styled.div`
    position: relative;
`



const EleBorderContent = styled.div`
    transition: height ${transDelay}s, width ${transDelay}s, background-color 4s;
    
    ${(props: iBorderProps) => {
            const backgroundColor = colors[props.state];
            const full = props.state > 0;
            const delay = props.state !== 0 ? (props.num - 1) * transDelay : (3 - (props.num - 1)) * transDelay;
            return `
                height: ${ full || props.num % 2 === 1 ? '100%' : 0 };
                width: ${ full || props.num % 2 === 0 ? '100%' : 0 };
                transition-delay: ${delay}s;
                background-color: ${backgroundColor};
            `
        }
    }

`

const ElError = styled.div`
    color: red;
    padding: 0.5em 0.5em 0;
    font-size: 0.9em;

    &::first-letter {
        text-transform: uppercase;
    }
`;


interface iBorderProps{
    state: number;
    num: number;
}

type iChange =  (value: string | undefined) => void | string

interface iPropsLabel {
    state: number,
}


interface iPropTypes {
    label: string;
    type?: string;
    name?: string;
    onChange?: iChange;
    defaultValue?: string;
    validator?: tValidator;
    errors?: iErrors;
    acceptType?: string;
}


export interface iDataHandler {
    [name: string]: string
}


export type tValidator = (value: string) => string

export interface iErrors {
    [fieldname: string]: string
}
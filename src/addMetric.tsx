import React, { useRef, Dispatch, ReactElement, RefObject, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { CustomInput, dataHandler, iErrors } from './Components/Input';
import { DataStructure, iData } from './Data';
import { IconClose } from './Icons/Close';

export const AddMetric = (props: iAddMetricProps) =>{
    const formRef = useRef<HTMLFormElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [errors, setError] = useState<iErrors>({});

    const data: iData = {};

    const close = closeForm(props.setAddWindow, formRef);
    const selection = props.selection ? props.selection[0] : 0;
    return <ElWrapper onClick = { smartDisable(containerRef, close) } >
        <ElContainer ref = { containerRef } >
            <ElButtonClose onClick = { close } ><IconClose /></ElButtonClose>
            <ElTitle >New Metric</ElTitle>
            <ElForm >
                { getInputs(data, props.editMode, props.data, selection, errors) }
                <ElButtonWrapper >
                    <ElButton onClick = {saveData(data, props.editMode, selection, props.setData, close, setError)} >Save</ElButton>
                    <ElButton type = 'button' onClick = { close } >Discard</ElButton>
                </ElButtonWrapper>
            </ElForm>
        </ElContainer>
    </ElWrapper>
}


const smartDisable = (container: RefObject<HTMLDivElement>, close: () => void) => {
    return (e: React.MouseEvent<Element>) => {
        e.preventDefault();
        const target = e.target;
        if (!target || !container.current) {
            return;
        }

        if (container.current.contains(target as Node)) {
            return;
        }
        close();
    }
}

const saveData = (data: iData, editMode: boolean, selection: number, setData: Dispatch<SetStateAction<iData[]>>, close: () => void, setErrors: Dispatch<SetStateAction<iErrors>>) => {
    return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let errors: iErrors = {};
        //Validate Data
        const keys = Object.keys(DataStructure);

        keys.forEach((key) => {
            if (DataStructure[key].required && !data[key]) {
                const label = DataStructure[key].label || key;
                errors[key] = `${label} can not be blank`;
            }
        });

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setData(currentData => {
            const newData = [...currentData];
            if (editMode) {
                newData[selection] = data;
            } else {
                newData.push(data);
            }
            
            return newData;
        })

        close();

        
    }
}

const closeForm = (setAddWindow: Dispatch<SetStateAction<boolean>>, formRef: RefObject<HTMLFormElement>) => {
    return () => {
        resetForm(formRef);
        setAddWindow(false);
    }
}


const resetForm = (form: RefObject<HTMLFormElement>) => {

    if (!form.current) {
        return;
    }

    const inputs = form.current.querySelectorAll('input');
    inputs.forEach((input) => input.value = '');

}

const getInputs = (data: iData, editMode: boolean, allData: iData[], selected: number, errors: iErrors) => {

    const inputs = Object.keys(DataStructure);
    const holder: ReactElement[] = [];
    let currentChildren:ReactElement[] = [];
   

    const pushChildren = (children: ReactElement[]) => {
        if (children.length === 0) {
            return;
        }
        holder.push(<ElChildlenWrapper key = {holder.length}>{children}</ElChildlenWrapper>);
    }

    for (let x = 0; x < inputs.length; x++) {
       
        if (currentChildren.length % 3 === 0) {
            pushChildren(currentChildren.slice(0));
            currentChildren = []
        }

        const label = inputs[x];
        let defaultValue = editMode && allData[selected][label] ? allData[selected][label] : '';

        
        currentChildren.push(<ElChildInputWrapper key = {currentChildren.length} >
            <CustomInput label = { label } errors = {errors} 
                acceptType = { DataStructure[label].type }
                defaultValue = {defaultValue}
                onChange = {  dataHandler(data, label) } />
            </ElChildInputWrapper>
        );

    }

    pushChildren(currentChildren);

    return holder;
}

const save = () => {
    return () => {

    }
}


const ElButtonClose = styled.button`
    width: 2.5em;
    height: 2.5em;
    position: absolute;
    right: 2em;
    top: 2em;
    background: none;
    padding: 0.65em;
    line-height: 0;
    border-radius: 0.4em;
    background-color: #f4f4f4;
    fill: #444;
   
    
`;

const ElWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
`

const ElContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 60em;
    height: max-content;
    margin: auto;
    background-color: #fff;
    padding: 2em 1em;
    border-radius: 0.5em;
    box-shadow: 0 0 1em -0.2em rgba(0,0,0, 0.3);

`;

const ElTitle = styled.p`
    font-size: 2em;
    padding: 0 0.5em;
    font-weight: 700;
`;

const ElForm = styled.form`
    padding: 1em 0;
`;

const ElChildInputWrapper = styled.fieldset`
    width: 33.3%;
    display: inline-block;
    vertical-align: top;
    padding: 0 1em;
`;

const ElChildlenWrapper = styled.div``;

const ElButtonWrapper = styled.div`
    padding: 1em 1em 0;
`;

const ElButton = styled.button`
    height: 3em;
    min-width: calc(33.3% - 1.25em);
    margin: 0 2em 0 0;
    border-radius: 0.5em;
    &:first-child {
        color: #fff;
        background-color: #2196f3;
    }
`;

interface iAddMetricProps {
    setAddWindow: Dispatch<SetStateAction<boolean>>;
    setData: Dispatch<SetStateAction<iData[]>>;
    editMode: boolean;
    selection: number[];
    data: iData[];
}
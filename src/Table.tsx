import React, {Dispatch, SetStateAction} from 'react';
import styled from 'styled-components';
import { CheckBox } from './Components/CheckBox';
import { DataStructure, iData } from './Data';

export const Table = (props: iTableProps) => {

    const headings = Object.keys(DataStructure);

    return <ElTable >
        <ElTHead >
            <ElTRow >
                <ElTData >
                    <CheckBox 
                        onChange = {setSelection(props.setSelected, props.data)}
                        manage = {false} selected = { props.data && props.selection.length === props.data.length}
                        mildSelect = { props.data &&  props.selection.length > 0 && props.selection.length !== props.data.length }
                    />
                </ElTData>
                { headings.map( (value, index) => {
                    const label = DataStructure[value].label || value;
                   return <ElTData key = {index} >{ label }</ElTData>
                }) }
            </ElTRow>
        </ElTHead>
        <ElTBody>
            {(!props.data || props.data.length === 0) && 
                <ElTRow >
                    <ElTData colSpan = {headings.length} className = 'no-data'  > No data available.
                        <ElAddNew onClick = { () => props.setAddWindow(true)} >Add new Metric </ElAddNew>
                    </ElTData>
                </ElTRow>
            }
            { props.data && props.data.length > 0 &&  <DisplayData selection = {props.selection} setSelected = {props.setSelected} headings = {headings} data = {props.data}  />
            }
        </ElTBody>
    </ElTable>
}


const DisplayData = (props: iDisplayDataProps) => {
    return <React.Fragment >
        {
            props.data && props.data.map(
                (dataItem, index) => {
    
                    return <ElTRow key = {index} >
                        <ElTData >
                            <CheckBox onChange = { selectOne(props.setSelected, index) } manage = {false} selected = { props.selection.indexOf(index) >= 0 } />
                        </ElTData>
                        { props.headings.map( (label, index) => {
                            const value: string = dataItem[label];
                           return <ElTData key = {index} >{ value }</ElTData>
                        }) }
                    </ElTRow>
                }
            )
        }
    </React.Fragment>
}



const setSelection = (setSelection: Dispatch<SetStateAction<number[]>>, data: (iData[] | undefined)) => {
    return () => {
        if (!data) {
            return;
        }

        setSelection ((currentSelection) => {
            let newSelection = [...currentSelection];
            if (newSelection.length === 0) {
                for (let x = 0; x < data.length; x++) {
                    newSelection.push(x);
                }
            } else {
                newSelection = [];
            }
            return newSelection;
        });
    }
}

const selectOne = (setSelection: Dispatch<SetStateAction<number[]>>, index: number) => {
    return () => {
        setSelection (currentState => {
            const itemIndex = currentState.indexOf(index);
            const newState = [...currentState];
            if (itemIndex >= 0) {
                newState.splice(itemIndex, 1);
            } else {
                newState.push(index);
            }            
            return newState;
        })
    }
}

const ElTable = styled.table`
    width: 100%;
    font-size: 0.9em;
`;

const ElTHead = styled.thead`
    font-weight: 500;
    border-bottom: 1px solid #eee;
    color: #555;
    td {
        vertical-align: middle;
        &::first-letter{
            text-transform: capitalize;
        }
    }
`;

const ElTRow = styled.tr``;

const ElTData = styled.td`
    padding: 0.75em 0.5em;
    &.no-data {
        text-align: center;
        padding: 2em;
        color: #777;
    }

`;

const ElAddNew = styled.button`
    display: inline-block;
    background: none;
    color: blue;
`


const ElTBody = styled.tbody``;



interface iTableProps {
    data?: iData[];
    setAddWindow: Dispatch<SetStateAction<boolean>>;
    setSelected: Dispatch<SetStateAction<number[]>>;
    selection: number[];
}

interface iDisplayDataProps {
    data?: iData[];
    setSelected: Dispatch<SetStateAction<number[]>>;
    selection: number[];
    headings: string[];
}
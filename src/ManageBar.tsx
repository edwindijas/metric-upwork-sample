import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { iData } from './Data';
import { IconGarbage } from './Icons/Garbage';
import { IconEdit } from './Icons/Edit';
import { IconAdd } from './Icons/Plus';
import { IconFilter } from './Icons/Filter';
import { IconFile } from './Icons/File';
import { IconSearch } from './Icons/Search';

export const ManageBar = (props: iManageBarProps) => {
    return <ElManageBar >
        <SearchBar />
        <ElControls >
            <ElButton onClick = { () => props.setAddWindow(true)} ><IconAdd />Add</ElButton>
            <ElButton className = 'edit' disableControl = { props.selected.length !== 1} onClick = { edit (props.setEdit, props.setAddWindow)} ><IconEdit />Edit</ElButton>
            <ElButton className = 'remove' onClick = {removeItems(props.selected, props.setData)} disableControl = { props.selected.length === 0 } ><IconGarbage />Remove</ElButton>
            
        </ElControls>
        <ElControls >
            <ElButton className = 'filter'><IconFilter />Filters</ElButton>
            <ElButton className = 'save' onClick = {saveItems(props.data)} ><IconFile />Save</ElButton>
        </ElControls>
    </ElManageBar>
}


const edit = (setEdit: (state: SetStateAction<boolean>, callback : (() => void)) => void, setAddWindow: Dispatch<SetStateAction<boolean>>) => {
    return () => {
        setEdit(true, () => {
            setAddWindow(true);
        })
        
    }
}

const SearchBar = () => {
    return <ElSearchBar >
        <ElSearchForm >
            <ElSearchLabel >Search item</ElSearchLabel>
            <ElSearchInput ></ElSearchInput>
            <ElSearchButton><IconSearch /></ElSearchButton>
        </ElSearchForm>
    </ElSearchBar>
}

const saveItems = (data: iData[]) => {
    return () => {
        if (!window.localStorage) {
            return;
        }

        window.localStorage.setItem('custom-metric-data-upwork', JSON.stringify(data));
    }
}


const removeItems = (selected: number[], setData: Dispatch<SetStateAction<iData[]>>) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
        
        e.preventDefault();
        e.stopPropagation();
        
        setData((currentState) => {
            const newState = [...currentState];

            for(let x = selected.length - 1; x >= 0; x-- ) {
                newState.splice(selected[x], 1);
            }
            return newState;
        })

    }
}

const ElManageBar = styled.div`
    height: 5em;
    padding: 0.5em;
    position: relative;
`;


const ElButton = styled.button`
    border-radius: 0.5em;
    margin: 0 0.5em;
    background: none;
    padding: 0 1em 0 2em;
    height: 2.5em;
    min-width: 6em;
    position: relative;
    box-shadow: 0.1em 0.1em 0.5em -0.3em #000;
    color: #777;
    fill: #777;
    opacity: 0.8;
    transition: opacity 0.5s, background-color 0.5s, color 0.5s;

    cursor: pointer;
    &:hover {
        opacity: 1;
    }

    &:focus, &:active {
        background-color: #2b4458;
        color: #fff;
        fill: #fff;
    }

    svg {
        position: absolute;
        left: 0;
        top: 0;
        width: 2.5em;
        height: 2.5em;
        padding: 0.75em;
        line-height: 0;
    }


    &.save {
        color: #009688;
        fill: #009688;
        box-shadow: 0.1em 0.1em 0.5em -0.3em #2b5652;
    }

    &.filter {
        color: #2196f3;
        fill: #2196f3;
        box-shadow: 0.1em 0.1em 0.5em -0.3em #2b4458;
    }

    &.edit {
        color: #673ab7;
        fill: #673ab7;
        box-shadow: 0.1em 0.1em 0.5em -0.3em #35284c;
    }

    &.remove {
        fill: #e91e63;
        color: #e91e63;
        box-shadow: 0.1em 0.1em 0.5em -0.3em #6d3145;
    }

    ${(props: iButtonProps) => {
        if (!props.disableControl) {
            return;
        }
        return `
            display: none;
        `;
    }}
`;


interface iButtonProps {
    disableControl?: boolean;  
}

interface iManageBarProps {
    setAddWindow: Dispatch<SetStateAction<boolean>>;
    setEdit: Dispatch<SetStateAction<boolean>>;
    setData: Dispatch<SetStateAction<iData[]>>;
    selected: number[];
    data: iData[];
}

const ElControls = styled.div`
    position: absolute;
    left: 28em;
    top: 1.25em;
    &:last-child {
        left: auto;
        right: 0;
    }
`;

const ElSearchBar = styled.div`
    width: 25em;
    height: 100%;
`;

const ElSearchForm = styled.form`
    padding: 0.5em 0;
    height: 100%;
    position: relative;
`;

const ElSearchInput = styled.input`
    height: 100%;
    width: 100%;
    background-color: #eee;
    border-radius: 0.5em;
`;


const ElSearchButton = styled.button`
    position: absolute;
    top: 0.5em;
    left: 0em;
    bottom: 0.5em;
    width: 3em;
    border-radius: 0.5em 0 0 0.5em;
    background-color: #ddd;
    transition: background-color 1s;
    svg {
        padding: 0.35em;
        fill: #666;
    }
    &:active {
        background-color: red;
    }
`;

const ElSearchLabel = styled.label`
    position: absolute;
    top: 0;
    bottom: 0;
    height: 1em;
    line-height: 1em;
    color: #888;
    left: 3.5em;
    margin: auto 0;
`;
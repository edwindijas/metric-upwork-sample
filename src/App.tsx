import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddMetric } from './addMetric';
import { iData } from './Data';
import { ManageBar } from './ManageBar';
import { Table } from './Table';

let callBack: (() => void) | null = null;

export default function App() {
  
  const [addWindow, closeWindow] = useState<boolean>(false);
  const [data, setData] = useState<iData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [edit, setEditState] = useState<boolean>(false);

  useEffect(() => {
    if (!window.localStorage) {
      return;
    }

    const items = window.localStorage.getItem('custom-metric-data-upwork');
    if (!items || items.length === 0) {
      return;
    }

    try {
      const data = JSON.parse(items);
      setData(data);
    } catch (e) {
      console.log(e);
    }

  }, [])

  useEffect(() => {
    if (!callBack) {
      return;
    }
    callBack();
    callBack = null;
  }, [edit])


  const setEdit = (function () {
    return (state: React.SetStateAction<boolean>, callback: (() => void) | undefined = undefined) => {
        if (callback) {
          callBack = () => {
            closeWindow(state);
          }
        }
        setEditState(state);
    }
  }());

  const setAddWindow = (function () {
    return (state: React.SetStateAction<boolean>, callback: (() => void) | undefined = undefined) => {
        if (addWindow) {
          setEdit(false);
        }

        if (callback) {
          callBack = () => {
            closeWindow(state);
          }
        }  else {
          closeWindow(state);
        }

    }
  }());

  

  return (
    <div className="App">
      <ElHeader className="App-header">
        
      </ElHeader>
      <ElMain >
        {addWindow && <AddMetric selection = {selected} data = {data} setAddWindow = { setAddWindow } editMode = {edit}  setData = {setData} />}
        <ManageBar setEdit = {setEdit} setAddWindow = { setAddWindow } setData = {setData} selected = {selected} data = {data}  />
        <Table setAddWindow = { setAddWindow } data = {data} setSelected = {setSelected} selection = {selected}  />
      </ElMain>
    </div>
  );
}


const ElHeader = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 18em;
  background-color: #eee;
`;


const ElMain = styled.main`
  height: 100vh;
  margin-left: 18em;
  padding: 1em;
`;

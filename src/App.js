import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};

function App() {
  const[name,setName]=useState("");
  const[list,setList]=useState(getLocalStorage());
  const[isEditing,setIsEditing]=useState(false);
  const[editID,setEditID]=useState(null);
  const[alert,setAlert]=useState({show:false,msg:'',type:''});

  const handelSubmit=(e)=>{
    e.preventDefault();
    if(!name){
      showAlert(true,'danger','Write some notes.')

    }
    else if(name && isEditing){
      setList(list.map((item)=>{
        if(item.id===editID){
          return{...item,title:name}
        }
        return item;
      }))
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true,'success',"Notes gets changed.")
    }
    else
    {
        showAlert(true,'success','Note gets added.')

        let createDateYear= new Date().getFullYear();
        let createMonth= new Date().getMonth();
        let createDate= new Date().getDate();
        let createHours= new Date().getHours();
        let createMinutes= new Date().getMinutes();
        let timeform;
        if(createHours== 24){ createHours=12; timeform='pm'}
        else if(createHours== 0){createHours=12;timeform='am'}
        else if(createHours>12){ createHours= createHours % 12; timeform='pm'}
        else{timeform="am"}
        let createRecentDate= createDateYear+ '/' + createMonth+ '/' + createDate;
        let createRecentTime= createHours+":"+ createMinutes+timeform;
        // console.log(createRecentDate);
        const newItem= {id: new Date().getTime().toString(), title: name, date:createRecentDate, time:createRecentTime};
        setList([...list,newItem]);
        setName("");
    }
  }

  const showAlert= (show=false,type="",msg='')=>{
    setAlert({show:show,type,msg})
  };
  const clearList=()=>{
    showAlert(true,'danger','Empty Notes');
    setList([]);
  }
  const removeItem=(id)=>{
    showAlert(true,'danger','Notes Removed.')
    setList(list.filter((item)=>item.id !== id))
  }

  const editItem= (id)=>{
    const specificItem= list.find((item)=> item.id ===id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
  <section className='section-center'>
    <form className='notes-form' onSubmit={handelSubmit} >
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
      <h3>Notes</h3>
      <div className='form-control'>
        <input type="text" className='notes' placeholder='e.g. presentation on monday' value={name} onChange={(e)=> setName(e.target.value)}/>
        <button type='submit' className='submit-btn'>{isEditing?'edit':'submit'}</button>
      </div>
    </form>
    {list.length>0 &&(
      <div className="grocery-container">
        <List items={list} removeItem={removeItem} editItem={editItem}/>
        <button className='clear-btn' onClick={clearList}>Clear Items</button>
      </div>
    )}
  </section>
  )
    }

export default App

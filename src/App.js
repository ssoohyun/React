import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Header(props) {
  //console.log('props', props, props.title);
  return <header>
    <h1><a href="/" onClick={/*function(event)*/(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lis = []
  for(let i=0; i<props.topics.length; i++) {
    let t = props.topics[i];
    //console.log('t.title', t.title);
    lis.push(<li key={t.id}><a id={t.id} href={'/read/'+t.id} onClick={event=>{
      event.preventDefault();
      props.onChangeMode(Number(event.target.id)); // 이벤트를 유발한 태그 (태그의 속성값이므로 문자(숫자X))
    }}>{t.title}</a>
    </li>);
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

// function Create(props) {
//   return <a href='/create' onClick={event=>{
//     event.preventDefault();
//     props.onChangeMode();
//   }}>Create</a>
// }

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{ // 기본: 페이지 reload
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"></input></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props) { // prop은 외부값: 변경X => state(내부값)로 바꿔서 처리한다!
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{ // 기본: 페이지 reload
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        console.log(event.target.value);
        setTitle(event.target.value);
      }}></input></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}

function App() {
  /*
  const _mode = useState('WELCOME'); // 배열 리턴 ([0]: 상태값, [1]: 상태값을 변경할 때 사용하는 함수)
  const mode = _mode[0];
  const setMode = _mode[1]; // 모드 값 변경
  //console.log('_mode', _mode);
  //console.log('mode[0]', mode);
  */
  
  // 읽기와 쓰기 interface
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);

  // const topics = useState[
  //   {id:1, title:'html', body:'html is ...'},
  //   {id:2, title:'css', body:'css is ...'},
  //   {id:3, title:'javascript', body:'javascript is ...'}
  // ]

  let content = null;
  let contextControl = null; // 맥락에 따라 노출

  if(mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if(mode === 'READ') {
    let title, body = null;
    for(let i=0; i<topics.length; i++) {
      //console.log(topics[i].id, id);
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = <>
      <li><a href={'/update/'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = []
        for(let i=0; i<topics.length; i++) {
          if(topics[i].id !== id) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}/></li>
    </> // grouping
  } else if(mode === 'CREATE') {
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id: nextId, title:_title, body:_body};
      const newTopics = [...topics]; // topics 복제본
      newTopics.push(newTopic); // 복제한 데이터 변경
      setTopics(newTopics); // 변경한 데이터 set
      setMode('READ'); // create하면 상세 설명이 나오게 set
      setId(nextId); // create한 상세 설명이 나오게 set
      setNextId(nextId+1); // 다음 id set
    }}></Create>;
  } else if(mode === 'UPDATE') {
    let title, body = null;
    for(let i=0; i<topics.length; i++) {
      //console.log(topics[i].id, id);
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      console.log(title, body);
      const newTopics = [...topics];
      const updatedTopic = {id:id, title:title, body:body};
      for(let i=0; i<newTopics.length; i++) {
        if(newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }


  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        //alert('Header');
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        //alert(id);
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      {/* <Create onChangeMode={()=>{
        //console.log('create');
        setMode('CREATE');
      }}></Create> */}
      <ul>
        <li>
          <a href="/create" onClick={event=>{
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
